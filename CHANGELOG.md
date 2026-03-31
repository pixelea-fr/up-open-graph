# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-03-31

### Added
- 📥 **Import JSON Schema.org**
  - Import direct depuis un JSON Schema.org
  - Mapping automatique des champs (type, nom, URL, téléphone, email, adresse, coordonnées GPS)
  - Support des types LocalBusiness, Organization, Restaurant, Store, etc.
  - Interface utilisateur avec zone de collage et bouton d'import
  - Auto-import au collage (paste)

## [1.0.0] - 2024-03-30

### Added
- 🌐 **Open Graph Support**
  - Complete Open Graph meta tags implementation
  - Support for multiple OG types (website, article, product, video, etc.)
  - Dynamic title, description, and image resolution
  - Automatic article metadata for blog posts
  - Facebook App ID integration

- 🐦 **Twitter Cards Integration**
  - Support for summary and summary_large_image cards
  - Automatic Twitter handle configuration
  - Seamless integration with Open Graph data

- 🏗️ **Schema.org JSON-LD**
  - Multiple schema types: Organization, LocalBusiness, Restaurant, Store, etc.
  - Complete business information support (address, phone, email)
  - Geographic coordinates for local SEO
  - Opening hours specification
  - Logo and image support

- 🎨 **Modern Admin Interface**
  - Dark theme with modern design
  - Real-time preview of social media cards
  - Intuitive tabbed navigation
  - Responsive layout for all screen sizes
  - Live configuration updates

- ⚙️ **Advanced Configuration**
  - Module-wise enable/disable functionality
  - Default settings for all metadata
  - Image picker integration with WordPress media library
  - Multi-language locale support
  - Import/Export capabilities (planned)

- 🔧 **Developer Features**
  - Comprehensive PHPDoc documentation
  - WordPress hooks and filters support
  - Modular class-based architecture
  - AJAX-powered admin interface
  - Security best practices with nonces and sanitization

- 📚 **Documentation**
  - Complete README with installation guide
  - Developer documentation with examples
  - GPL-2.0+ license included
  - Comprehensive changelog

### Technical Details
- **Minimum Requirements**: WordPress 5.0+, PHP 7.4+
- **Database**: Uses WordPress options API (no custom tables)
- **Performance**: Optimized with minimal database queries
- **Security**: Full sanitization and CSRF protection
- **Compatibility**: Tested with major WordPress themes and plugins

### Security
- All user inputs properly sanitized
- CSRF protection with WordPress nonces
- Capability-based access control
- SQL injection prevention through WordPress APIs
- XSS protection with proper escaping

### Performance
- Minimal database queries (1-2 per page load)
- Efficient caching of settings
- Lazy loading of admin assets
- Optimized JavaScript and CSS delivery
- No impact on frontend performance when disabled

## [Unreleased]

### Planned Features
- 📱 Social media analytics integration
- 🔄 Automatic social image generation
- 🌍 Multi-language support
- 📊 Advanced A/B testing for metadata
- 🛒 WooCommerce integration
- 🎯 SEO scoring system
- 📦 Bulk import/export functionality
- 🔍 Rich snippets testing tool

### Potential Improvements
- Cache integration (WP Rocket, W3 Total Cache, etc.)
- CDN support for images
- Advanced schema types (Article, Product, Event)
- Social media sharing buttons
- Open Graph image optimization
- Twitter Card analytics
- Facebook Instant Articles support

---

## Support

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/nicolas-gehin/up-open-graph/issues)
- **Support**: [WordPress.org Forums](https://wordpress.org/support/plugin/up-open-graph)

## Contributing

We welcome contributions! Please see [README.md](README.md) for guidelines on how to contribute to this project.

---

*Last updated: March 30, 2024*
