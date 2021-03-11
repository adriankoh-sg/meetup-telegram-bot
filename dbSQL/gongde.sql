-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 11, 2021 at 03:15 AM
-- Server version: 10.4.17-MariaDB
-- PHP Version: 8.0.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gongde`
--

-- --------------------------------------------------------

--
-- Table structure for table `tggroup`
--

CREATE TABLE `tggroup` (
  `id` int(11) NOT NULL,
  `groupName` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `tggrouplink`
--

CREATE TABLE `tggrouplink` (
  `group_id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Table structure for table `tgsettings`
--

CREATE TABLE `tgsettings` (
  `token` varchar(120) NOT NULL,
  `botName` varchar(50) NOT NULL,
  `webhook` varchar(200) NOT NULL,
  `welcomeMessage` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `tgsettings`
--

INSERT INTO `tgsettings` (`token`, `botName`, `webhook`, `welcomeMessage`) VALUES
('1577233399:AAEb6-TgdyyDzip-VDLLmKF0RUbzhvEEDAw', 'Gongde_bot', 'http://localhost/gongde/api/telegram/hookUpdate.php', '<b>Welcome To Gong De TZRC bot</b>\nThis is the Telegram Bot create to help:\n- Send auto reminder of classes, meetings and LY\n- Help to coordinate manpower for LY\n欢迎大家来到<b>公德堂主人才网上平台</b>。\n此平台创建的目的是为了通知各位有关班期、座谈会、了愿事项等等。\n感谢天恩师德');

-- --------------------------------------------------------

--
-- Table structure for table `tgsubscriber`
--

CREATE TABLE `tgsubscriber` (
  `chat_id` int(11) NOT NULL,
  `firstName` varchar(30) NOT NULL,
  `lastName` varchar(30) NOT NULL,
  `userName` varchar(30) NOT NULL,
  `knowName` varchar(30) NOT NULL,
  `validUser` tinyint(4) DEFAULT 0,
  `createOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


--
-- Indexes for dumped tables
--

--
-- Indexes for table `tggroup`
--
ALTER TABLE `tggroup`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tgsettings`
--
ALTER TABLE `tgsettings`
  ADD UNIQUE KEY `token` (`token`);

--
-- Indexes for table `tgsubscriber`
--
ALTER TABLE `tgsubscriber`
  ADD PRIMARY KEY (`chat_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tggroup`
--
ALTER TABLE `tggroup`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
