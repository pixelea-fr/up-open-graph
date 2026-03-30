<?php
/**
 * UP Open Graph - Meta Output
 *
 * @package UP_Open_Graph
 * @version 1.0.0
 * @author  GEHIN Nicolas
 * @license GPL-2.0+
 */

defined('ABSPATH') || exit;

/**
 * Gestion de la sortie des métadonnées Open Graph et Twitter Cards
 *
 * Cette classe gère la génération et l'affichage des balises méta
 * dans le <head> des pages WordPress.
 *
 * @since 1.0.0
 */
class UP_OG_Meta_Output {

    /**
     * Initialise les hooks de sortie des métadonnées
     *
     * @since 1.0.0
     * @return void
     */
    public static function init() {
        add_action('wp_head', [__CLASS__, 'output_tags'], 1);
    }

    /**
     * Affiche toutes les balises méta Open Graph et Twitter Cards
     *
     * @since 1.0.0
     * @return void
     */
    public static function output_tags() {
        // Résoudre les valeurs dynamiques selon la page courante
        $title       = self::resolve_title();
        $description = self::resolve_description();
        $image       = self::resolve_image();
        $url         = self::resolve_url();
        $type        = UP_OG_Settings::get('og_type', 'website');
        $site_name   = UP_OG_Settings::get('og_site_name', get_bloginfo('name'));
        $locale      = UP_OG_Settings::get('og_locale', 'fr_FR');
        $fb_app_id   = UP_OG_Settings::get('fb_app_id');

        echo "\n<!-- UP Open Graph -->\n";

        // === OPEN GRAPH ===
        if (UP_OG_Settings::is_enabled('og')) {
            self::meta('og:type',        $type);
            self::meta('og:title',       $title);
            self::meta('og:description', $description);
            self::meta('og:url',         $url);
            self::meta('og:site_name',   $site_name);
            self::meta('og:locale',      $locale);
            if ($image) self::meta('og:image', $image);
            if ($fb_app_id) self::meta('fb:app_id', $fb_app_id);

            // Article specifics
            if (is_single()) {
                self::meta('og:type', 'article');
                self::meta('article:published_time', get_the_date('c'));
                self::meta('article:modified_time', get_the_modified_date('c'));
                $author = get_the_author_meta('display_name');
                if ($author) self::meta('article:author', $author);
            }
        }

        // === TWITTER CARDS ===
        if (UP_OG_Settings::is_enabled('twitter')) {
            $card         = UP_OG_Settings::get('twitter_card', 'summary_large_image');
            $twitter_site = UP_OG_Settings::get('twitter_site');
            self::meta_name('twitter:card',        $card);
            self::meta_name('twitter:title',       $title);
            self::meta_name('twitter:description', $description);
            if ($image) self::meta_name('twitter:image', $image);
            if ($twitter_site) self::meta_name('twitter:site', '@' . ltrim($twitter_site, '@'));
        }

        echo "<!-- / UP Open Graph -->\n\n";
    }

    /**
     * Détermine le titre Open Graph selon le contexte
     *
     * @since 1.0.0
     * @return string Titre formaté
     */
    private static function resolve_title() {
        if (is_singular()) return get_the_title() . ' | ' . get_bloginfo('name');
        if (is_home() || is_front_page()) return UP_OG_Settings::get('og_title', get_bloginfo('name'));
        if (is_tax() || is_category() || is_tag()) return single_term_title('', false) . ' | ' . get_bloginfo('name');
        return UP_OG_Settings::get('og_title', get_bloginfo('name'));
    }

    /**
     * Détermine la description Open Graph selon le contexte
     *
     * @since 1.0.0
     * @return string Description formatée
     */
    private static function resolve_description() {
        if (is_singular()) {
            $excerpt = get_the_excerpt();
            if ($excerpt) return wp_strip_all_tags($excerpt);
        }
        return UP_OG_Settings::get('og_description', get_bloginfo('description'));
    }

    /**
     * Détermine l'image Open Graph selon le contexte
     *
     * @since 1.0.0
     * @return string URL de l'image ou chaîne vide
     */
    private static function resolve_image() {
        if (is_singular() && has_post_thumbnail()) {
            return get_the_post_thumbnail_url(null, 'large');
        }
        return UP_OG_Settings::get('og_image');
    }

    /**
     * Détermine l'URL Open Graph selon le contexte
     *
     * @since 1.0.0
     * @return string URL de la page courante
     */
    private static function resolve_url() {
        return is_singular() ? get_permalink() : (is_home() ? home_url('/') : get_pagenum_link());
    }

    /**
     * Affiche une balise meta property
     *
     * @since 1.0.0
     * @param string $property Attribut property
     * @param string $content  Attribut content
     * @return void
     */
    private static function meta($property, $content) {
        if (empty($content)) return;
        echo '<meta property="' . esc_attr($property) . '" content="' . esc_attr($content) . '">' . "\n";
    }

    /**
     * Affiche une balise meta name
     *
     * @since 1.0.0
     * @param string $name    Attribut name
     * @param string $content  Attribut content
     * @return void
     */
    private static function meta_name($name, $content) {
        if (empty($content)) return;
        echo '<meta name="' . esc_attr($name) . '" content="' . esc_attr($content) . '">' . "\n";
    }
}
