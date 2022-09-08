-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server Version:               10.4.24-MariaDB - mariadb.org binary distribution
-- Server Betriebssystem:        Win64
-- HeidiSQL Version:             12.0.0.6468
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Exportiere Datenbank Struktur für grandganglife
CREATE DATABASE IF NOT EXISTS `grandganglife` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `grandganglife`;

-- Exportiere Struktur von Tabelle grandganglife.players
CREATE TABLE IF NOT EXISTS `players` (
  `Id` int(11) DEFAULT NULL,
  `username` varchar(500) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  `email` varchar(500) DEFAULT NULL,
  `promo` varchar(500) DEFAULT NULL,
  `social` varchar(500) DEFAULT NULL,
  `hwid` varchar(500) DEFAULT NULL,
  `ip` varchar(500) DEFAULT NULL,
  `position` varchar(5000) DEFAULT '{"x":-1035.77,"y":-2748.4,"z":21.36}',
  `money` int(11) DEFAULT 5000,
  `bank` int(11) DEFAULT 0,
  `grandcoins` int(11) DEFAULT 0,
  `grandpoints` int(11) DEFAULT 0,
  `isnew` int(11) DEFAULT 1,
  `adminlevel` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Exportiere Daten aus Tabelle grandganglife.players: ~0 rows (ungefähr)
INSERT INTO `players` (`Id`, `username`, `password`, `email`, `promo`, `social`, `hwid`, `ip`, `position`, `money`, `bank`, `grandcoins`, `grandpoints`, `isnew`, `adminlevel`) VALUES
	(1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '{"x":-1035.77,"y":-2748.4,"z":21.36}', 5000, 0, 0, 0, 1, 1),
	(2, 'Younes_Xal', '12345', 'frxgyakume@gmail.com', '', 'Slurpydurpy187', 'Fehlt', 'Fehlt', '{"x":-1035.77,"y":-2748.4,"z":21.36}', 5000, 0, 0, 0, 1, 3),
	(3, 'Antonio_Baxter', 'oliver', 'meisnoname12@gmail.com', '', 'E6IIRA2', 'Fehlt', 'Fehlt', '{"x":-1035.77,"y":-2748.4,"z":21.36}', 5000, 0, 0, 0, 1, 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
