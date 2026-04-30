import { Router, Request, Response } from 'express';
import httpStatus from 'http-status';
import auth from '../app/middlewares/auth';
import { USER_ROLE } from '../app/modules/User/user.constant';
import { uploadContentImage } from '../lib/multer/multer';
import { catchAsync } from '../app/utils/catchAsync';
import sendResponse from '../app/utils/sendResponse';

// ============================================================================
// CONTENT IMAGE UPLOAD — for inline Markdown images
// ============================================================================

const router = Router();

/**
 * POST /api/upload/content-image
 * Upload a single image to be used inside Markdown content.
 * Returns the URL to insert into Markdown: ![alt](/uploads/blog/content-xxxx.jpg)
 */
router.post(
  '/upload/content-image',
  auth(USER_ROLE.ADMIN),
  uploadContentImage.single('image'),
  catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'No image file uploaded',
        data: null,
      });
    }

    const imageUrl = `/uploads/blog/${req.file.filename}`;
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Content image uploaded',
      data: { url: imageUrl },
    });
  })
);

export default router;
