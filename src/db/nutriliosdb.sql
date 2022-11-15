-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-11-2022 a las 23:34:40
-- Versión del servidor: 10.4.21-MariaDB
-- Versión de PHP: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nutriliosdb`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `ID_producto` int(255) NOT NULL,
  `nombre_producto` text NOT NULL,
  `stock_producto` int(255) NOT NULL,
  `adquisitionPrice_producto` decimal(65,0) NOT NULL,
  `sellingPrice_producto` decimal(65,0) NOT NULL,
  `description_producto` varchar(100) NOT NULL,
  `category_producto` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`ID_producto`, `nombre_producto`, `stock_producto`, `adquisitionPrice_producto`, `sellingPrice_producto`, `description_producto`, `category_producto`) VALUES
(1, 'Camisa nutria', 10, '99', '220', 'Camisa color azul con la nutria de la facultad', 'Souvenirs'),
(2, 'Libro Fogu Competencia Comunicativa', 20, '50', '110', 'Libro FOGU  de competencia comunicativa', 'Libros');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `products`
--

CREATE TABLE `products` (
  `product_id` int(255) NOT NULL,
  `product_name` varchar(200) NOT NULL,
  `product_stock` int(255) NOT NULL,
  `product_sellingprice` decimal(65,4) NOT NULL,
  `product_adquisitionprice` decimal(65,4) NOT NULL,
  `product_description` varchar(255) NOT NULL,
  `product_category` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `products`
--

INSERT INTO `products` (`product_id`, `product_name`, `product_stock`, `product_sellingprice`, `product_adquisitionprice`, `product_description`, `product_category`) VALUES
(4, 'Bata de laboratorio', 0, '230.0000', '120.0000', 'Bata de laboratorio con logotipo de la facultad', 'Material de laboratorio'),
(18, 'Termo nutria FASPYN', 50, '60.0000', '30.0000', 'Termo de 500 ml color, varios colores', 'Souvenirs'),
(19, 'Libro SMAE', 50, '220.0000', '120.0000', 'Libro nuevo SMAE', 'Libros'),
(20, 'Lapiz', 100, '8.0000', '1.0000', 'Lápiz Sencillo del número 2', 'Material escolar'),
(21, 'Nuevo', 100, '200.0000', '100.0000', 'Producto nuevo', 'Manuales');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salidas`
--

CREATE TABLE `salidas` (
  `salida_id` int(255) NOT NULL,
  `salida_productos` varchar(8000) NOT NULL,
  `salida_responsable` varchar(255) NOT NULL,
  `salida_fecha` varchar(255) NOT NULL,
  `salida_tipo` varchar(255) NOT NULL,
  `salida_total` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `salidas`
--

INSERT INTO `salidas` (`salida_id`, `salida_productos`, `salida_responsable`, `salida_fecha`, `salida_tipo`, `salida_total`) VALUES
(1, '[{\"product_id\":3,\"product_name\":\"asdfa\",\"unites\":\"6\",\"sellingPrice\":1324,\"subtotal\":7944},{\"product_id\":1,\"product_name\":\"Camisa Nutria FASPYN editado\",\"unites\":\"1\",\"sellingPrice\":190,\"subtotal\":190},{\"product_id\":14,\"product_name\":\"edicion\",\"unites\":\"2\",\"sellingPrice\":12,\"subtotal\":24}]', 'Usuario anónimo', '24/10/2022', 'Venta', '8158'),
(2, '[{\"product_id\":1,\"product_name\":\"Camisa Nutria FASPYN editado\",\"unites\":\"2\",\"sellingPrice\":190,\"subtotal\":380}]', 'Usuario anónimo', '25/10/2022', 'Cortesía', '380'),
(3, '[{\"product_id\":4,\"product_name\":\"Bata de laboratorio\",\"unites\":\"1\",\"sellingPrice\":230,\"subtotal\":230}]', 'Usuario anónimo', '25/10/2022', 'Merma', '230'),
(4, '[{\"product_id\":1,\"product_name\":\"Camisa Nutria FASPYN editado\",\"unites\":\"2\",\"sellingPrice\":190,\"subtotal\":380}]', 'Usuario anónimo', '25/10/2022', 'Venta', '380'),
(5, '[{\"product_id\":18,\"product_name\":\"Termo nutria FASPYN\",\"unites\":\"1\",\"sellingPrice\":60,\"subtotal\":60}]', 'Usuario anónimo', '25/10/2022', 'Venta', '60'),
(6, '[{\"product_id\":20,\"product_name\":\"Lapiz\",\"unites\":\"1\",\"sellingPrice\":8,\"subtotal\":8},{\"product_id\":4,\"product_name\":\"Bata de laboratorio\",\"unites\":\"1\",\"sellingPrice\":230,\"subtotal\":230}]', 'Usuario anónimo', '26/10/2022', 'Venta', '238'),
(7, '[{\"product_id\":18,\"product_name\":\"Termo nutria FASPYN\",\"unites\":\"1\",\"sellingPrice\":60,\"subtotal\":60}]', 'Usuario anónimo', '26/10/2022', 'Venta', '60'),
(8, '[{\"product_id\":1,\"product_name\":\"Camisa Nutria FASPYN editado\",\"unites\":\"1\",\"sellingPrice\":190,\"subtotal\":190}]', 'Usuario anónimo', '26/10/2022', 'Cortesía', '190'),
(9, '[{\"product_id\":21,\"product_name\":\"Nuevo\",\"unites\":\"1\",\"sellingPrice\":200,\"subtotal\":200}]', 'Usuario anónimo', '26/10/2022', 'Venta', '200'),
(10, '[{\"product_id\":18,\"product_name\":\"Termo nutria FASPYN\",\"unites\":\"3\",\"sellingPrice\":60,\"subtotal\":180}]', 'Usuario anónimo', '26/10/2022', 'Cortesía', '180');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`ID_producto`);

--
-- Indices de la tabla `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);

--
-- Indices de la tabla `salidas`
--
ALTER TABLE `salidas`
  ADD PRIMARY KEY (`salida_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `ID_producto` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `salidas`
--
ALTER TABLE `salidas`
  MODIFY `salida_id` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
