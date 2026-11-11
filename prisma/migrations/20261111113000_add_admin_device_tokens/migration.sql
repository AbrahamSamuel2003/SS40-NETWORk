-- CreateTable
CREATE TABLE "AdminDeviceToken" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL DEFAULT 'android',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminDeviceToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminDeviceToken_token_key" ON "AdminDeviceToken"("token");

-- CreateIndex
CREATE INDEX "AdminDeviceToken_adminUserId_idx" ON "AdminDeviceToken"("adminUserId");

-- AddForeignKey
ALTER TABLE "AdminDeviceToken" ADD CONSTRAINT "AdminDeviceToken_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

