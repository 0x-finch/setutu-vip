import { FastifyInstance, FastifyPluginOptions } from "fastify";
import bcrypt from "bcryptjs";
import fs from "fs";

import { signJwt } from "../../libs/sign-jwt";
import path from "path";

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
};
