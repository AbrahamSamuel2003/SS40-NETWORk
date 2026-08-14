-- Remove the unused contactSectionImageUrl column from SiteConfig.
-- The ContactMethods component was redesigned to use a three-equal-card
-- layout without an image, making this field dead data.
ALTER TABLE "SiteConfig" DROP COLUMN IF EXISTS "contactSectionImageUrl";
