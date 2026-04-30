import { Router } from "express";
import { UserRoutes } from "../app/modules/User/user.routes";
import { AuthRoutes } from "../app/modules/auth/auth.routes";
import { BannerRoutes } from "../app/modules/Banner/banner.routes";
import { ServiceRoutes } from "../app/modules/Service/service.routes";
import { ProjectRoutes } from "../app/modules/Project/project.routes";
import { GalleryRoutes } from "../app/modules/Gallery/gallery.routes";
import { BlogRoutes } from "../app/modules/Blog/blog.routes";
import { TestimonialRoutes } from "../app/modules/Testimonial/testimonial.routes";
import { TeamMemberRoutes } from "../app/modules/TeamMember/teamMember.routes";
import { InquiryRoutes } from "../app/modules/Inquiry/inquiry.routes";
import { BookingRoutes } from "../app/modules/Booking/booking.routes";
import { SiteSettingsRoutes } from "../app/modules/SiteSettings/siteSettings.routes";
import { NewsletterRoutes } from "../app/modules/Newsletter/newsletter.routes";
import uploadRoutes from "./upload.routes";

const routes = Router();

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * API ROUTES — ArchNest Studio
 * ═══════════════════════════════════════════════════════════════════════════════
 */

const moduleRoutes = [
  // ── Core ──
  { path: "/auth", route: AuthRoutes },
  { path: "/users", route: UserRoutes },
  { path: "/banners", route: BannerRoutes },

  // ── Phase 1: Foundation ──
  { path: "/services", route: ServiceRoutes },
  { path: "/projects", route: ProjectRoutes },

  // ── Phase 2: Content & Social Proof ──
  { path: "/gallery", route: GalleryRoutes },
  { path: "/blogs", route: BlogRoutes },
  { path: "/testimonials", route: TestimonialRoutes },
  { path: "/team-members", route: TeamMemberRoutes },

  // ── Phase 3: Interaction ──
  { path: "/inquiries", route: InquiryRoutes },
  { path: "/bookings", route: BookingRoutes },

  // ── Phase 4: Admin & Settings ──
  { path: "/settings", route: SiteSettingsRoutes },
  { path: "/newsletter", route: NewsletterRoutes },
];

moduleRoutes.forEach((route) => routes.use(route.path, route.route));

// Content image upload (for Markdown inline images)
routes.use(uploadRoutes);

export default routes;
