<?php
/**
 * UP Open Graph - Schema.org JSON-LD
 *
 * @package UP_Open_Graph
 * @version 1.0.0
 * @author  GEHIN Nicolas
 * @license GPL-2.0+
 */

defined('ABSPATH') || exit;

/**
 * Gestion des données structurées Schema.org en JSON-LD
 *
 * Cette classe gère la génération des schémas JSON-LD
 * pour le référencement sémantique et les moteurs de recherche.
 *
 * @since 1.0.0
 */
class UP_OG_Schema {

    /**
     * Initialise les hooks de sortie Schema.org
     *
     * @since 1.0.0
     * @return void
     */
    public static function init() {
        add_action('wp_head', [__CLASS__, 'output_schema'], 2);
    }

    /**
     * Affiche le schéma JSON-LD dans le head
     *
     * @since 1.0.0
     * @return void
     */
    public static function output_schema() {
        if (!UP_OG_Settings::is_enabled('schema')) return;

        $type = UP_OG_Settings::get('schema_type', 'Organization');
        $schema = self::build($type);
        if (empty($schema)) return;

        echo '<script type="application/ld+json">' . "\n";
        echo wp_json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
        echo "\n" . '</script>' . "\n";
    }

    /**
     * Construit le schéma JSON-LD selon le type
     *
     * @since 1.0.0
     * @param string $type Type de schéma (Organization, LocalBusiness, etc.)
     * @return array Schéma formaté pour JSON-LD
     */
    public static function build($type) {
        $base = [
            '@context' => 'https://schema.org',
            '@type'    => $type,
            'name'     => UP_OG_Settings::get('schema_name', get_bloginfo('name')),
            'url'      => UP_OG_Settings::get('schema_url', get_site_url()),
        ];

        $logo = UP_OG_Settings::get('schema_logo');
        if ($logo) $base['logo'] = $logo;

        $image = UP_OG_Settings::get('schema_image');
        if ($image) $base['image'] = $image;

        // Contact
        $tel = UP_OG_Settings::get('schema_telephone');
        if ($tel) $base['telephone'] = $tel;

        $email = UP_OG_Settings::get('schema_email');
        if ($email) $base['email'] = $email;

        // Address
        $street  = UP_OG_Settings::get('schema_street');
        $city    = UP_OG_Settings::get('schema_city');
        $zip     = UP_OG_Settings::get('schema_zip');
        $country = UP_OG_Settings::get('schema_country', 'FR');

        if ($street || $city || $zip) {
            $base['address'] = [
                '@type'           => 'PostalAddress',
                'streetAddress'   => $street,
                'addressLocality' => $city,
                'postalCode'      => $zip,
                'addressCountry'  => $country,
            ];
        }

        // Geo
        $lat = UP_OG_Settings::get('schema_lat');
        $lng = UP_OG_Settings::get('schema_lng');
        if ($lat && $lng) {
            $base['geo'] = [
                '@type'     => 'GeoCoordinates',
                'latitude'  => (float) $lat,
                'longitude' => (float) $lng,
            ];
        }

        // Opening hours
        $hours = UP_OG_Settings::get('schema_hours', []);
        if (!empty($hours) && is_array($hours)) {
            $specs = [];
            foreach ($hours as $h) {
                if (!empty($h['days']) && !empty($h['opens']) && !empty($h['closes'])) {
                    $specs[] = [
                        '@type'     => 'OpeningHoursSpecification',
                        'dayOfWeek' => (array) $h['days'],
                        'opens'     => $h['opens'],
                        'closes'    => $h['closes'],
                    ];
                }
            }
            if ($specs) $base['openingHoursSpecification'] = $specs;
        }

        return $base;
    }
}
