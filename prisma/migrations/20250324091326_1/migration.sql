-- CreateTable
CREATE TABLE `beritas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL,
    `deskripsi` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `data_joki` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` TEXT NOT NULL,
    `email_joki` TEXT NOT NULL,
    `password_joki` TEXT NOT NULL,
    `loginvia_joki` TEXT NOT NULL,
    `nickname_joki` TEXT NOT NULL,
    `request_joki` TEXT NOT NULL,
    `catatan_joki` TEXT NOT NULL,
    `status_joki` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposits` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `metode` VARCHAR(191) NOT NULL,
    `deposit_id` VARCHAR(191) NULL,
    `no_pembayaran` VARCHAR(191) NOT NULL,
    `jumlah` INTEGER NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `deposits_no_pembayaran_key`(`no_pembayaran`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `footer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_footer` TEXT NOT NULL,
    `url_footer` TEXT NULL,
    `parent` INTEGER NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kategoris` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(191) NOT NULL,
    `sub_nama` VARCHAR(191) NOT NULL,
    `brand` TEXT NOT NULL,
    `kode` VARCHAR(191) NULL,
    `server_id` INTEGER NOT NULL DEFAULT 0,
    `status` VARCHAR(191) NOT NULL DEFAULT 'active',
    `thumbnail` VARCHAR(191) NOT NULL,
    `tipe` VARCHAR(191) NOT NULL DEFAULT 'game',
    `petunjuk` VARCHAR(191) NULL,
    `ket_layanan` TEXT NULL,
    `ket_id` TEXT NULL,
    `placeholder_1` TEXT NOT NULL,
    `placeholder_2` TEXT NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,
    `bannerlayanan` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `layanans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategori_id` INTEGER NOT NULL,
    `sub_category_id` INTEGER NOT NULL DEFAULT 0,
    `layanan` VARCHAR(191) NOT NULL,
    `provider_id` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `harga_reseller` INTEGER NOT NULL,
    `harga_platinum` INTEGER NOT NULL,
    `harga_gold` INTEGER NOT NULL,
    `harga_flash_sale` INTEGER NULL DEFAULT 0,
    `profit` INTEGER NOT NULL,
    `profit_reseller` INTEGER NOT NULL,
    `profit_platinum` INTEGER NOT NULL,
    `profit_gold` INTEGER NOT NULL,
    `is_flash_sale` BOOLEAN NOT NULL,
    `judul_flash_sale` TEXT NULL,
    `banner_flash_sale` TEXT NULL,
    `expired_flash_sale` DATE NULL,
    `catatan` LONGTEXT NOT NULL,
    `status` BOOLEAN NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `product_logo` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `methods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(55) NOT NULL,
    `images` VARCHAR(250) NOT NULL,
    `code` VARCHAR(100) NOT NULL,
    `keterangan` VARCHAR(250) NOT NULL,
    `tipe` VARCHAR(225) NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ovos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `RefId` VARCHAR(191) NOT NULL,
    `UpdateAccessToken` VARCHAR(1000) NOT NULL,
    `AuthToken` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembayarans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `harga` VARCHAR(191) NOT NULL,
    `no_pembayaran` TEXT NULL,
    `no_pembeli` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `metode` VARCHAR(191) NOT NULL,
    `reference` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `pembayarans_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pembelians` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NULL,
    `zone` VARCHAR(191) NULL,
    `nickname` VARCHAR(191) NULL,
    `email_vilog` TEXT NULL,
    `password_vilog` TEXT NULL,
    `loginvia_vilog` TEXT NULL,
    `layanan` VARCHAR(191) NOT NULL,
    `harga` INTEGER NOT NULL,
    `profit` INTEGER NOT NULL,
    `provider_order_id` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL,
    `log` VARCHAR(1000) NULL,
    `sn` VARCHAR(191) NULL,
    `tipe_transaksi` VARCHAR(191) NOT NULL DEFAULT 'game',
    `is_digi` BOOLEAN NOT NULL,
    `ref_id` VARCHAR(191) NULL,
    `success_report_sended` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `pembelians_order_id_key`(`order_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `setting_webs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `judul_web` VARCHAR(191) NOT NULL,
    `deskripsi_web` VARCHAR(191) NOT NULL,
    `keyword` VARCHAR(191) NOT NULL,
    `og_image` VARCHAR(191) NULL,
    `logo_header` VARCHAR(191) NULL,
    `logo_footer` VARCHAR(191) NULL,
    `logo_favicon` VARCHAR(191) NULL,
    `logo_banner` VARCHAR(191) NULL,
    `logo_cs` VARCHAR(191) NULL,
    `url_wa` VARCHAR(191) NOT NULL,
    `url_ig` VARCHAR(191) NOT NULL,
    `url_tiktok` VARCHAR(191) NOT NULL,
    `url_youtube` VARCHAR(191) NOT NULL,
    `url_fb` VARCHAR(191) NOT NULL,
    `kbrstore_api` VARCHAR(191) NOT NULL,
    `slogan_web` VARCHAR(191) NOT NULL,
    `snk` VARCHAR(191) NOT NULL,
    `privacy` VARCHAR(191) NOT NULL,
    `warna1` VARCHAR(191) NOT NULL,
    `warna2` VARCHAR(191) NOT NULL,
    `warna3` VARCHAR(191) NOT NULL,
    `warna4` VARCHAR(191) NOT NULL,
    `warna5` VARCHAR(191) NOT NULL,
    `harga_gold` VARCHAR(191) NOT NULL,
    `harga_platinum` VARCHAR(191) NOT NULL,
    `tripay_api` VARCHAR(191) NULL,
    `tripay_merchant_code` VARCHAR(191) NULL,
    `tripay_private_key` VARCHAR(191) NULL,
    `duitku_key` VARCHAR(191) NULL,
    `duitku_merchant` VARCHAR(191) NULL,
    `username_digi` VARCHAR(191) NULL,
    `api_key_digi` VARCHAR(191) NULL,
    `apigames_secret` VARCHAR(191) NULL,
    `apigames_merchant` VARCHAR(191) NULL,
    `vip_apiid` VARCHAR(191) NULL,
    `vip_apikey` VARCHAR(191) NULL,
    `digi_seller_user` VARCHAR(191) NULL,
    `digi_seller_key` VARCHAR(191) NULL,
    `nomor_admin` VARCHAR(191) NULL,
    `wa_key` VARCHAR(191) NULL,
    `wa_number` VARCHAR(191) NULL,
    `ovo_admin` VARCHAR(191) NULL,
    `ovo1_admin` VARCHAR(191) NULL,
    `gopay_admin` VARCHAR(191) NULL,
    `gopay1_admin` VARCHAR(191) NULL,
    `dana_admin` VARCHAR(191) NULL,
    `shopeepay_admin` VARCHAR(191) NULL,
    `bca_admin` VARCHAR(191) NULL,
    `mandiri_admin` VARCHAR(191) NULL,
    `logo_ceo` VARCHAR(191) NULL,
    `sejarah` VARCHAR(191) NOT NULL,
    `sejarah_1` VARCHAR(191) NOT NULL,
    `visi` VARCHAR(191) NOT NULL,
    `misi` VARCHAR(191) NOT NULL,
    `nama_ceo` VARCHAR(191) NOT NULL,
    `deskripsi_ceo` VARCHAR(191) NOT NULL,
    `nama_bagan` VARCHAR(191) NOT NULL,
    `alamat` VARCHAR(191) NOT NULL,
    `telp` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `waPending` VARCHAR(191) NULL,
    `waPaid` VARCHAR(191) NULL,
    `waProcess` VARCHAR(191) NULL,
    `waSuccess` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_id` INTEGER NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NULL,
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(225) NULL,
    `balance` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `otp` VARCHAR(191) NULL,
    `api_key` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `last_payment_at` DATETIME(3) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `provider_account_id` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    UNIQUE INDEX `accounts_provider_provider_account_id_key`(`provider`, `provider_account_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sessions` (
    `id` VARCHAR(191) NOT NULL,
    `session_token` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sessions_session_token_key`(`session_token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_auth` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `email_verified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `users_auth_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verification_tokens` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `verification_tokens_token_key`(`token`),
    UNIQUE INDEX `verification_tokens_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vouchers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `discountType` VARCHAR(191) NOT NULL,
    `discountValue` DOUBLE NOT NULL,
    `maxDiscount` DOUBLE NULL,
    `minPurchase` DOUBLE NULL,
    `usageLimit` INTEGER NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `is_for_all_categories` BOOLEAN NOT NULL DEFAULT false,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `start_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiry_date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vouchers_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voucher_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voucher_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    UNIQUE INDEX `voucher_categories_voucher_id_category_id_key`(`voucher_id`, `category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pembelians` ADD CONSTRAINT `pembelians_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `pembayarans`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_auth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users_auth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_categories` ADD CONSTRAINT `voucher_categories_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voucher_categories` ADD CONSTRAINT `voucher_categories_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `kategoris`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
