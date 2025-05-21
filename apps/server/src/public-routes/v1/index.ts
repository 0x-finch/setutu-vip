import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcryptjs";
import fs from "fs";
import { isEmail } from "validator";
import { signJwt } from "../../libs/sign-jwt";

export const routes = async (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  fastify.post("/sign-up", async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!process.env.BOSS_EMAIL || process.env.BOSS_EMAIL !== email) {
      return {
        code: 200,
        data: null,
        message: "success",
      };
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    fs.writeFileSync("boss.json", JSON.stringify({ email, password: hash }));

    return {
      code: 201,
      data: null,
      message: "success",
    };
  });

  fastify.post("/sign-in", async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!process.env.BOSS_EMAIL || process.env.BOSS_EMAIL !== email) {
      return {
        code: 200,
        data: null,
        message: "success",
      };
    }

    const user = JSON.parse(fs.readFileSync("boss.json", "utf8"));
    if (user.email !== email || !bcrypt.compareSync(password, user.password)) {
      return {
        code: 200,
        data: null,
        message: "success",
      };
    }

    const jwt = await signJwt(email);

    return {
      code: 200,
      data: {
        jwt,
      },
      message: "success",
    };
  });

  fastify.post("/api-sign-up", async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!isEmail(email)) {
      return {
        code: 400,
        data: null,
        message: {
          en: "Invalid email",
          cn: "无效的邮箱",
          ko: "유효하지 않은 이메일",
          jp: "無効なメールアドレス",
        },
      };
    }

    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const pgConn = await fastify.pg.connect();
      const result = await pgConn.query(
        "SELECT COUNT(*) FROM api_service WHERE created_at::date = CURRENT_DATE;"
      );

      if (result.rows[0].count >= 200) {
        return {
          code: 400,
          data: null,
          message: {
            en: "Too many requests for today(200/day), please try again tomorrow.",
            cn: "今天注册的账户数量已达上限(200/天)，请明天再试。",
            ko: "오늘 하루 최대 200개의 계정 등록 요청이 있었습니다. 내일 다시 시도해주세요.",
            jp: "今日は200件のアカウント登録要求がありました。明日もう一度試してください。",
          },
        };
      }

      await pgConn.query(
        "INSERT INTO api_service (email, password, created_at) VALUES ($1, $2, $3)",
        [email, hash, new Date()]
      );

      return {
        code: 201,
        data: null,
        message: "success",
      };
    } catch (error) {
      return {
        code: 500,
        data: null,
        message: {
          en: "Internal server error",
          cn: "服务器内部错误",
          ko: "서버 내부 오류",
          jp: "サーバー内部エラー",
        },
      };
    }
  });

  fastify.post("/api-sign-in", async (req, res) => {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (!isEmail(email)) {
      return {
        code: 400,
        data: null,
        message: {
          en: "Invalid email",
          cn: "无效的邮箱",
          ko: "유효하지 않은 이메일",
          jp: "無効なメールアドレス",
        },
      };
    }

    const pgConn = await fastify.pg.connect();
    const result = await pgConn.query(
      "SELECT * FROM api_service WHERE email = $1",
      [email]
    );

    if (
      result.rows.length === 0 ||
      !bcrypt.compareSync(password, result.rows[0].password)
    ) {
      return {
        code: 400,
        data: null,
        message: {
          en: "Invalid email or password",
          cn: "无效的邮箱或密码",
          ko: "유효하지 않은 이메일 또는 비밀번호",
          jp: "無効なメールアドレスまたはパスワード",
        },
      };
    }

    const jwt = await signJwt(email, "30d", true);
    return {
      code: 200,
      data: {
        jwt,
      },
      message: "success",
    };
  });
};
