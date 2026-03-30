<?php
/**
 * UP Open Graph - Settings Management
 *
 * @package UP_Open_Graph
 * @version 1.0.0
 * @author  GEHIN Nicolas
 * @license GPL-2.0+
 */

defined('ABSPATH') || exit;

/**
 * Gestion des paramètres du plugin UP Open Graph
 *
 * Cette classe gère toutes les opérations de lecture/écriture des options
 * du plugin en utilisant l'API WordPress options.
 *
 * @since 1.0.0
 */
class UP_OG_Settings {

    /**
     * Initialise les hooks de la classe
     *
     * @since 1.0.0
     * @return void
     */
    public static function init() {}

    /**
     * Récupère une option du plugin
     *
     * @since 1.0.0
     * @param string $key     Nom de l'option (sans le préfixe)
     * @param mixed  $default Valeur par défaut si l'option n'existe pas
     * @return mixed Valeur de l'option
     */
    public static function get($key, $default = '') {
        return get_option('up_og_' . $key, $default);
    }

    /**
     * Sauvegarde une option du plugin
     *
     * @since 1.0.0
     * @param string $key   Nom de l'option (sans le préfixe)
     * @param mixed  $value Valeur à sauvegarder
     * @return bool True si réussi, false sinon
     */
    public static function set($key, $value) {
        return update_option('up_og_' . $key, $value);
    }

    /**
     * Vérifie si une fonctionnalité est activée
     *
     * @since 1.0.0
     * @param string $feature Nom de la fonctionnalité (og, twitter, schema)
     * @return bool True si activée, false sinon
     */
    public static function is_enabled($feature) {
        return (bool) self::get($feature . '_enabled', 1);
    }

    /**
     * Récupère toutes les options du plugin
     *
     * @since 1.0.0
     * @return array Tableau associatif de toutes les options
     */
    public static function all() {
        $keys = [
            'og_enabled', 'schema_enabled', 'twitter_enabled',
            'og_type', 'og_title', 'og_description', 'og_site_name',
            'og_locale', 'og_image', 'twitter_card', 'twitter_site',
            'schema_type', 'schema_name', 'schema_url', 'schema_telephone',
            'schema_email', 'schema_street', 'schema_city', 'schema_zip',
            'schema_country', 'schema_lat', 'schema_lng', 'schema_hours',
            'schema_logo', 'schema_image', 'fb_app_id',
        ];
        $data = [];
        foreach ($keys as $key) {
            $data[$key] = self::get($key);
        }
        return $data;
    }

    /**
     * Sauvegarde plusieurs options en une seule fois
     *
     * @since 1.0.0
     * @param array $data Tableau associatif des options à sauvegarder
     * @return void
     */
    public static function save(array $data) {
        foreach ($data as $key => $value) {
            self::set($key, $value);
        }
    }
}
