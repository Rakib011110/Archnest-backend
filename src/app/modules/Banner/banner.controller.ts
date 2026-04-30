import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BannerService } from './banner.services';

export const uploadImage = catchAsync(async (req, res) => {
  console.log('🖼️ [Banner] Upload request received');

  if (!req.file) {
    console.log('❌ [Banner] No image file uploaded');
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: 'No image file uploaded',
      data: null,
    });
  }

  // Get local file path
  const imageUrl = `/uploads/banner/${req.file.filename}`;

  console.log('✅ [Banner] Image uploaded successfully:', {
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    path: imageUrl
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Image uploaded successfully',
    data: { imagePath: imageUrl },
  });
});

export const createBanner = catchAsync(async (req, res) => {
  const result = await BannerService.createBanner(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Banner created successfully',
    data: result,
  });
});

export const getAllBanners = catchAsync(async (_req, res) => {
  const result = await BannerService.getAllBanners();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banners fetched successfully',
    data: result,
  });
});

export const getBanner = catchAsync(async (req, res) => {
  const result = await BannerService.getBannerById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner fetched successfully',
    data: result,
  });
});

export const updateBanner = catchAsync(async (req, res) => {
  const result = await BannerService.updateBanner(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner updated successfully',
    data: result,
  });
});

export const deleteBanner = catchAsync(async (req, res) => {
  const result = await BannerService.deleteBanner(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Banner deleted successfully',
    data: result,
  });
});