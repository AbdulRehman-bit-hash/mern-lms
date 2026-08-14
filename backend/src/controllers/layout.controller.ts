import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "../utils/cloudinary";

// ------------------- Create layout (banner / faq / categories) -------------------

export const createLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      const isTypeExist = await LayoutModel.findOne({ type });
      if (isTypeExist) {
        return next(new ErrorHandler(`${type} already exists`, 400));
      }

      if (type === "Banner") {
        const { image, title, subTitle } = req.body;

        const banner: any = { title, subTitle };

        // Only attempt an upload if an actual image was provided — an
        // empty string would otherwise crash Cloudinary's upload call.
        if (image) {
          const myCloud = await cloudinary.uploader.upload(image, {
            folder: "layout",
          });
          banner.image = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
          };
        }

        await LayoutModel.create({ type: "Banner", banner });
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItems = await Promise.all(
          faq.map((item: any) => ({
            question: item.question,
            answer: item.answer,
          }))
        );
        await LayoutModel.create({ type: "FAQ", faq: faqItems });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesItems = await Promise.all(
          categories.map((item: any) => ({ title: item.title }))
        );
        await LayoutModel.create({
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({ success: true, message: "Layout created successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Edit layout -------------------

export const editLayout = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type } = req.body;

      if (type === "Banner") {
        const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
        const { image, title, subTitle } = req.body;

        if (!bannerData) {
          // Nothing to edit yet — create it instead of crashing on a null id.
          const banner: any = { title, subTitle };
          if (image && !image.startsWith("https")) {
            const myCloud = await cloudinary.uploader.upload(image, {
              folder: "layout",
            });
            banner.image = {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            };
          }
          await LayoutModel.create({ type: "Banner", banner });
        } else {
          if (image && !image.startsWith("https") && bannerData.banner?.image?.public_id) {
            await cloudinary.uploader.destroy(bannerData.banner.image.public_id);
          }

          const myCloud =
            image && !image.startsWith("https")
              ? await cloudinary.uploader.upload(image, { folder: "layout" })
              : null;

          const banner = {
            image: myCloud
              ? { public_id: myCloud.public_id, url: myCloud.secure_url }
              : bannerData?.banner?.image,
            title,
            subTitle,
          };

          await LayoutModel.findByIdAndUpdate(bannerData._id, { banner });
        }
      }

      if (type === "FAQ") {
        const { faq } = req.body;
        const faqItem = await LayoutModel.findOne({ type: "FAQ" });
        const faqItems = await Promise.all(
          faq.map((item: any) => ({
            question: item.question,
            answer: item.answer,
          }))
        );
        await LayoutModel.findByIdAndUpdate(faqItem?._id, {
          type: "FAQ",
          faq: faqItems,
        });
      }

      if (type === "Categories") {
        const { categories } = req.body;
        const categoriesData = await LayoutModel.findOne({
          type: "Categories",
        });
        const categoriesItems = await Promise.all(
          categories.map((item: any) => ({ title: item.title }))
        );
        await LayoutModel.findByIdAndUpdate(categoriesData?._id, {
          type: "Categories",
          categories: categoriesItems,
        });
      }

      res.status(200).json({ success: true, message: "Layout updated successfully" });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// ------------------- Get layout by type -------------------

export const getLayoutByType = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const layout = await LayoutModel.findOne({ type: req.params.type });
      res.status(201).json({ success: true, layout });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
