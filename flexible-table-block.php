<?php
/**
 * Plugin Name: Comet Components Table Block
 * Description: Enables advanced table creation in the block editor, with Comet Components used for front-end rendering. Forked from Flexible Table Block by Aki Hamano.
 * Requires at least: 6.7.1
 * Requires PHP: 8.2
 * Version: 0.0.1
 * Author: Double-E Design
 * Text Domain: comet
 * Requires plugins: comet-plugin
 */

defined( 'ABSPATH' ) || exit;

define( 'FTB_BLOCK_CLASS', 'wp-block-flexible-table-block-table' );
define( 'FTB_NAMESPACE', 'flexible-table-block' );
define( 'FTB_OPTION_PREFIX', 'flexible_table_block' );
define( 'FTB_PATH', untrailingslashit( plugin_dir_path( __FILE__ ) ) );
define( 'FTB_URL', untrailingslashit( plugin_dir_url( __FILE__ ) ) );

require_once __DIR__ . '/classes/class-init.php';

new Flexible_Table_Block\Init();
