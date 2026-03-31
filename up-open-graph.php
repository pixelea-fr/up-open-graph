<?php
/**
 * Plugin Name: UP Open Graph
 * Plugin URI:  https://pixelea.fr/up-open-graph
 * Description: Gestion avancée des balises Open Graph, Twitter Cards et données structurées Schema.org
 * Version:     1.0.3
 * Author:      GEHIN Nicolas
 * Author URI:  https://pixelea.fr
 * Text Domain: up-open-graph
 * Domain Path: /languages
 * License:     GPL-2.0+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Requires PHP: 7.4
 * Requires WP: 5.0
 *
 * @package UP_Open_Graph
 * @version 1.0.3
 * @author  GEHIN Nicolas
 * @license GPL-2.0+
 */

// Protection contre l'accès direct
defined('ABSPATH') || exit;

// Constantes du plugin
define('UP_OG_VERSION', '1.0.3');
define('UP_OG_PATH', plugin_dir_path(__FILE__));
define('UP_OG_URL', plugin_dir_url(__FILE__));

// Inclusion des classes principales
require_once UP_OG_PATH . 'includes/class-settings.php';
require_once UP_OG_PATH . 'includes/class-meta-output.php';
require_once UP_OG_PATH . 'includes/class-schema.php';
require_once UP_OG_PATH . 'includes/class-admin.php';

/**
 * Initialise le plugin après le chargement de WordPress
 *
 * Cette fonction est appelée sur le hook 'plugins_loaded' pour s'assurer
 * que toutes les fonctionnalités WordPress sont disponibles.
 *
 * @since 1.0.0
 * @return void
 */
add_action('plugins_loaded', function () {
    UP_OG_Settings::init();
    UP_OG_Meta_Output::init();
    UP_OG_Schema::init();
    if (is_admin()) {
        UP_OG_Admin::init();
    }
});

/**
 * Hook d'activation du plugin
 *
 * Initialise les options par défaut lors de la première activation.
 * Les options ne sont écrasées que si elles n'existent pas déjà.
 *
 * @since 1.0.0
 * @return void
 */
register_activation_hook(__FILE__, function () {
    $defaults = [
        // Modules
        'og_enabled'       => 1,
        'schema_enabled'   => 1,
        'twitter_enabled'  => 1,
        
        // Open Graph
        'og_type'          => 'website',
        'og_title'         => get_bloginfo('name'),
        'og_description'   => get_bloginfo('description'),
        'og_site_name'     => get_bloginfo('name'),
        'og_locale'        => 'fr_FR',
        'og_image'         => '',
        
        // Twitter
        'twitter_card'     => 'summary_large_image',
        'twitter_site'     => '',
        
        // Schema.org
        'schema_type'      => 'Organization',
        'schema_name'      => get_bloginfo('name'),
        'schema_url'       => get_site_url(),
        'schema_telephone' => '',
        'schema_email'     => '',
        'schema_street'    => '',
        'schema_city'      => '',
        'schema_zip'       => '',
        'schema_country'   => 'FR',
        'schema_lat'       => '',
        'schema_lng'       => '',
        'schema_hours'     => [],
        'schema_logo'      => '',
        'schema_image'     => '',
        
        // Facebook
        'fb_app_id'        => '',
    ];
    
    // Sauvegarde des options par défaut uniquement si elles n'existent pas
    foreach ($defaults as $key => $value) {
        if (get_option('up_og_' . $key) === false) {
            update_option('up_og_' . $key, $value);
        }
    }
});
