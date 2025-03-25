-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 19, 2025 at 03:59 PM
-- Server version: 8.0.41-0ubuntu0.20.04.1
-- PHP Version: 7.4.3-4ubuntu2.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `Twitter_Db`
--

-- --------------------------------------------------------

--
-- Table structure for table `blocks_tbl`
--

CREATE TABLE `blocks_tbl` (
  `id` int NOT NULL,
  `blocker_id` int NOT NULL,
  `blocked_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Manages block relationships between users';

-- --------------------------------------------------------

--
-- Table structure for table `comments_tbl`
--

CREATE TABLE `comments_tbl` (
  `id` int NOT NULL,
  `tweet_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Manages comments on tweets';

-- --------------------------------------------------------

--
-- Table structure for table `followers_tbl`
--

CREATE TABLE `followers_tbl` (
  `id` int NOT NULL,
  `follower_id` int NOT NULL,
  `followed_id` int NOT NULL,
  `followed_at` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='followers: Manages follow relationships between users';

-- --------------------------------------------------------

--
-- Table structure for table `likes_tbl`
--

CREATE TABLE `likes_tbl` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  `created_at` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Manages likes on tweets';

-- --------------------------------------------------------

--
-- Table structure for table `retweets_tbl`
--

CREATE TABLE `retweets_tbl` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Manages retweets of tweets';

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `session_tbl`
--

CREATE TABLE `session_tbl` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `status` varchar(25) NOT NULL DEFAULT 'Active',
  `session_id` varchar(200) NOT NULL,
  `login_time` text,
  `logout_time` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tweets_tbl`
--

CREATE TABLE `tweets_tbl` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` text,
  `modified_at` text,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = False, 1 = True'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Stores tweets made by users';

-- --------------------------------------------------------

--
-- Table structure for table `users_tbl`
--

CREATE TABLE `users_tbl` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `f_name` varchar(50) NOT NULL,
  `l_name` varchar(50) NOT NULL,
  `user_bio` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `user_email` varchar(200) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'user',
  `profile_img` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `is_user_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = False, 1 = True',
  `is_email_verified` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = False, 1 = True',
  `is_active` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = False, 1 = True',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '0 = False, 1 = True',
  `timezone` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'UTC',
  `created_at` text,
  `modified_at` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Stores user information';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blocks_tbl`
--
ALTER TABLE `blocks_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blocker_id` (`blocker_id`,`blocked_id`),
  ADD KEY `blocked_id` (`blocked_id`);

--
-- Indexes for table `comments_tbl`
--
ALTER TABLE `comments_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tweet_id` (`tweet_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `followers_tbl`
--
ALTER TABLE `followers_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `follower_id` (`follower_id`,`followed_id`),
  ADD KEY `followed_id` (`followed_id`);

--
-- Indexes for table `likes_tbl`
--
ALTER TABLE `likes_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`tweet_id`),
  ADD KEY `tweet_id` (`tweet_id`);

--
-- Indexes for table `retweets_tbl`
--
ALTER TABLE `retweets_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `retweets_tbl_ibfk_1` (`user_id`),
  ADD KEY `tweet_id` (`tweet_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `session_tbl`
--
ALTER TABLE `session_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tweets_tbl`
--
ALTER TABLE `tweets_tbl`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users_tbl`
--
ALTER TABLE `users_tbl`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `user_email` (`user_email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blocks_tbl`
--
ALTER TABLE `blocks_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `comments_tbl`
--
ALTER TABLE `comments_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `followers_tbl`
--
ALTER TABLE `followers_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes_tbl`
--
ALTER TABLE `likes_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `retweets_tbl`
--
ALTER TABLE `retweets_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `session_tbl`
--
ALTER TABLE `session_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tweets_tbl`
--
ALTER TABLE `tweets_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users_tbl`
--
ALTER TABLE `users_tbl`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blocks_tbl`
--
ALTER TABLE `blocks_tbl`
  ADD CONSTRAINT `blocks_tbl_ibfk_1` FOREIGN KEY (`blocker_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blocks_tbl_ibfk_2` FOREIGN KEY (`blocked_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comments_tbl`
--
ALTER TABLE `comments_tbl`
  ADD CONSTRAINT `comments_tbl_ibfk_1` FOREIGN KEY (`tweet_id`) REFERENCES `tweets_tbl` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_tbl_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `followers_tbl`
--
ALTER TABLE `followers_tbl`
  ADD CONSTRAINT `followers_tbl_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `followers_tbl_ibfk_2` FOREIGN KEY (`followed_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes_tbl`
--
ALTER TABLE `likes_tbl`
  ADD CONSTRAINT `likes_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_tbl_ibfk_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets_tbl` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `retweets_tbl`
--
ALTER TABLE `retweets_tbl`
  ADD CONSTRAINT `retweets_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retweets_tbl_ibfk_2` FOREIGN KEY (`tweet_id`) REFERENCES `tweets_tbl` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `session_tbl`
--
ALTER TABLE `session_tbl`
  ADD CONSTRAINT `session_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT;

--
-- Constraints for table `tweets_tbl`
--
ALTER TABLE `tweets_tbl`
  ADD CONSTRAINT `tweets_tbl_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users_tbl` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
