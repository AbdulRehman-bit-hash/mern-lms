import { Response } from "express";
import { IUser } from "../models/user.model";
import { redis } from "./redis";
require("dotenv").config();

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure: boolean;
}

const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "5",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "3",
  10
);

const isProduction = process.env.NODE_ENV === "production";

// In local dev, frontend and backend both run on "localhost" (just
// different ports), which browsers treat as the same site — so
// sameSite: "lax" works fine there without needing secure: true.
//
// In production, the frontend and backend almost always live on different
// real domains (e.g. Vercel + Render). Browsers only send cookies across
// different domains if sameSite is "none" — and "none" is only honored by
// browsers when the cookie also has secure: true. Getting this wrong
// doesn't just weaken security, it silently breaks login entirely in
// production (the cookie gets set but never sent back), so both values
// need to flip together based on environment.
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  // Cache the user session in Redis
  redis.set(String(user._id), JSON.stringify(user) as any);

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
