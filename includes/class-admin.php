<?php
/**
 * UP Open Graph - Admin Interface
 *
 * @package UP_Open_Graph
 * @version 1.0.0
 * @author  GEHIN Nicolas
 * @license GPL-2.0+
 */

defined('ABSPATH') || exit;

/**
 * Gestion de l'interface d'administration du plugin
 *
 * Cette classe gère l'interface utilisateur dans l'admin WordPress,
 * y compris le menu, les assets, et les requêtes AJAX.
 *
 * @since 1.0.0
 */
class UP_OG_Admin {

    /**
     * Initialise les hooks de l'administration
     *
     * @since 1.0.0
     * @return void
     */
    public static function init() {
        add_action('admin_menu', [__CLASS__, 'register_menu']);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_assets']);
        add_action('wp_ajax_up_og_save', [__CLASS__, 'ajax_save']);
        add_action('wp_ajax_up_og_preview', [__CLASS__, 'ajax_preview']);
    }

    /**
     * Enregistre le menu d'administration
     *
     * @since 1.0.0
     * @return void
     */
    public static function register_menu() {
        add_menu_page(
            'UP Open Graph',
            'UP Open Graph',
            'manage_options',
            'up-open-graph',
            [__CLASS__, 'render_page'],
            'dashicons-share',
            80
        );
    }

    /**
     * Charge les assets CSS/JS de l'administration
     *
     * @since 1.0.0
     * @param string $hook Hook de la page courante
     * @return void
     */
    public static function enqueue_assets($hook) {
        if ($hook !== 'toplevel_page_up-open-graph') return;
        wp_enqueue_media();
        wp_enqueue_style('up-og-admin', UP_OG_URL . 'assets/admin.css', [], UP_OG_VERSION);
        wp_enqueue_script('up-og-admin', UP_OG_URL . 'assets/admin.js', ['jquery'], UP_OG_VERSION, true);
        wp_localize_script('up-og-admin', 'UP_OG', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('up_og_nonce'),
            'settings' => UP_OG_Settings::all(),
            'site_url' => get_site_url(),
            'site_name'=> get_bloginfo('name'),
        ]);
    }

    /**
     * Gère la requête AJAX de sauvegarde
     *
     * @since 1.0.0
     * @return void
     */
    public static function ajax_save() {
        check_ajax_referer('up_og_nonce', 'nonce');
        if (!current_user_can('manage_options')) wp_send_json_error('Unauthorized');

        $allowed = [
            'og_enabled', 'schema_enabled', 'twitter_enabled',
            'og_type', 'og_title', 'og_description', 'og_site_name',
            'og_locale', 'og_image', 'twitter_card', 'twitter_site',
            'schema_type', 'schema_name', 'schema_url', 'schema_telephone',
            'schema_email', 'schema_street', 'schema_city', 'schema_zip',
            'schema_country', 'schema_lat', 'schema_lng', 'schema_hours',
            'schema_logo', 'schema_image', 'fb_app_id',
        ];

        foreach ($allowed as $key) {
            if ($key === 'schema_hours') {
                $value = isset($_POST[$key]) ? $_POST[$key] : '';
                // Decode JSON from JavaScript
                $hours = json_decode($value, true);
                $clean_hours = [];
                if (is_array($hours)) {
                    foreach ($hours as $h) {
                        $clean_hours[] = [
                            'days'   => array_map('sanitize_text_field', (array) ($h['days'] ?? [])),
                            'opens'  => sanitize_text_field($h['opens'] ?? ''),
                            'closes' => sanitize_text_field($h['closes'] ?? ''),
                        ];
                    }
                }
                UP_OG_Settings::set($key, $clean_hours);
            } elseif (in_array($key, ['og_enabled', 'schema_enabled', 'twitter_enabled'])) {
                $value = isset($_POST[$key]) ? $_POST[$key] : '0';
                UP_OG_Settings::set($key, $value === '1' ? 1 : 0);
            } else {
                UP_OG_Settings::set($key, sanitize_text_field(wp_unslash($_POST[$key] ?? '')));
            }
        }

        wp_send_json_success(['message' => 'Paramètres sauvegardés avec succès.']);
    }

    /**
     * Gère la requête AJAX de prévisualisation Schema
     *
     * @since 1.0.0
     * @return void
     */
    public static function ajax_preview() {
        check_ajax_referer('up_og_nonce', 'nonce');
        // Return current schema for preview
        $type   = sanitize_text_field($_POST['schema_type'] ?? 'Organization');
        $schema = UP_OG_Schema::build($type);
        wp_send_json_success(['schema' => wp_json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT)]);
    }

    /**
     * Affiche la page d'administration
     *
     * @since 1.0.0
     * @return void
     */
    public static function render_page() {
        ?>
        <div id="up-og-app">
            <!-- App rendered by JS -->
            <div class="up-og-loading">
                <div class="up-og-spinner"></div>
                <span>Chargement...</span>
            </div>
        </div>
        <?php
    }
}
