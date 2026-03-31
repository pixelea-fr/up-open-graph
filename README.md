# UP Open Graph



🔗 **Gestion avancée des balises Open Graph, Twitter Cards et données structurées Schema.org pour WordPress**

UP Open Graph est un plugin WordPress moderne et complet qui vous permet de configurer facilement les métadonnées sociales essentielles pour optimiser le partage de votre contenu sur Facebook, Twitter, LinkedIn et autres plateformes sociales.

## ✨ Fonctionnalités principales

### 🌐 **Open Graph**
- Configuration complète des balises `og:title`, `og:description`, `og:image`, `og:url`
- Support des types multiples (website, article, product, video, etc.)
- Gestion automatique des images à la une
- Configuration des locales multilingues

### 🐦 **Twitter Cards**
- Support des types `summary`, `summary_large_image`, `app`, `player`
- Configuration automatique des comptes Twitter
- Intégration parfaite avec les balises Open Graph

### 🏗️ **Schema.org JSON-LD**
- Types multiples : Organization, LocalBusiness, Restaurant, Store, etc.
- Informations complètes : adresse, téléphone, horaires d'ouverture
- Coordonnées géographiques pour le référencement local
- Support des logos et images d'entreprise

### 🎨 **Interface admin moderne**
- Design sombre élégant et responsive
- Prévisualisation en temps réel des métadonnées
- Navigation intuitive par onglets
- Sauvegarde instantanée avec feedback utilisateur

## 🚀 Installation

### Installation automatique (recommandée)
1. Dans votre admin WordPress, allez dans **Extensions → Ajouter**
2. Recherchez "UP Open Graph"
3. Cliquez sur **Installer maintenant**, puis **Activer**

### Installation manuelle
1. Téléchargez le plugin depuis
2. Décompressez l'archive et uploadez le dossier `up-open-graph` dans `/wp-content/plugins/`
3. Dans votre admin WordPress, activez le plugin

## 📖 Utilisation

### Configuration initiale
1. Après activation, allez dans **UP Open Graph** dans le menu admin
2. Configurez les informations de base de votre site
3. Activez/désactivez les modules selon vos besoins
4. Cliquez sur **Enregistrer** pour sauvegarder

### Open Graph
- **Titre par défaut** : Utilisé pour la page d'accueil et les pages sans titre spécifique
- **Description par défaut** : Description fallback pour les pages sans extrait
- **Image par défaut** : Image utilisée quand aucune image n'est disponible
- **Type OG** : `website` par défaut, `article` pour les articles du blog

### Twitter Cards
- **Type de card** : Choisissez entre `summary` et `summary_large_image`
- **Compte Twitter** : Votre handle Twitter (sans le @)

### Schema.org
- **Type de schema** : Choisissez le type qui correspond à votre activité
- **Sous-types** : Les sous-types spécialisés sont exportés avec un type racine + `additionalType`
- **Informations** : Complétez les détails de votre entreprise
- **Horaires** : Ajoutez vos plages horaires d'ouverture

### Import JSON Schema.org
Le plugin supporte l'import direct depuis un JSON Schema.org pour faciliter la configuration :

1. Allez dans l'onglet **Schema.org**
2. Collez votre JSON dans le champ "Importer depuis JSON"
3. Les champs sont automatiquement remplis

**Exemple de JSON supporté :**
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Mon Entreprise",
  "url": "https://monsite.com",
  "logo": "https://monsite.com/logo.png",
  "telephone": "+33 1 23 45 67 89",
  "address": {
    "streetAddress": "123 rue Example",
    "addressLocality": "Paris",
    "postalCode": "75001",
    "addressCountry": "FR"
  },
  "geo": {
    "latitude": 48.8566,
    "longitude": 2.3522
  }
}
```

**Champs mappés automatiquement :**
- `@type` → Type de schema
- `name`, `url`, `telephone`, `email` → Identité
- `logo`, `image` → Images
- `address.*` → Adresse complète
- `geo.*` → Coordonnées GPS

**Comportement des sous-types :**
- Si vous choisissez un sous-type comme `ArchitecturalService`, le schéma généré utilise le type racine correspondant (`ProfessionalService`)
- Le sous-type est conservé dans `additionalType` pour garder l'information spécialisée

## 🎯 Cas d'utilisation

### **Blog personnel**
```yaml
og_type: article
schema_type: Person
twitter_card: summary_large_image
```

### **Site d'entreprise**
```yaml
og_type: website  
schema_type: Organization
twitter_card: summary
```

### **Restaurant**
```yaml
og_type: website
schema_type: Restaurant
twitter_card: summary_large_image
```

### **Boutique en ligne**
```yaml
og_type: product
schema_type: Store
twitter_card: summary_large_image
```

## ⚙️ Configuration avancée

### Filtres WordPress personnalisés

Le plugin expose plusieurs filtres pour les développeurs :

```php
// Modifier le titre Open Graph
add_filter('up_og_title', function($title) {
    return $title . ' | Mon Site';
});

// Modifier la description Open Graph  
add_filter('up_og_description', function($description) {
    return substr($description, 0, 160);
});

// Modifier l'image Open Graph
add_filter('up_og_image', function($image) {
    if (has_post_thumbnail()) {
        return get_the_post_thumbnail_url(null, 'large');
    }
    return $image;
});
```

### Hooks disponibles

```php
// Action avant la sortie des métadonnées
add_action('up_og_before_output', function() {
    // Votre code ici
});

// Action après la sortie des métadonnées
add_action('up_og_after_output', function() {
    // Votre code ici
});
```

## 🔧 Dépannage

### Problèmes courants

**Les images ne s'affichent pas sur Facebook ?**
- Vérifiez que l'image est accessible publiquement
- Utilisez l'outil [Facebook Debugger](https://developers.facebook.com/tools/debug/)
- Assurez-vous que l'image fait au moins 1200x630px

**Les balises n'apparaissent pas dans le code source ?**
- Vérifiez que les modules sont activés dans les paramètres
- Assurez-vous qu'il n'y a pas de conflit avec un autre plugin SEO
- Videz votre cache et celui de votre CDN

**Twitter Cards ne fonctionnent pas ?**
- Testez avec le [Card Validator](https://cards-dev.twitter.com/validator)
- Vérifiez que votre domaine est approuvé par Twitter


## 🤝 Contribution

Nous apprécions toute contribution ! Voici comment participer :

### Signaler un bug
1. Vérifiez qu'il n'existe pas déjà
2. Créez une nouvelle issue avec :
   - Description détaillée du problème
   - Version de WordPress et du plugin
   - Screenshots si nécessaire

### Proposer une amélioration
1. Fork le projet
2. Créez une branche `feature/nom-de-la-fonctionnalite`
3. Commitez vos changements
4. Push et créez une Pull Request vers le repository principal

### Développement local

```bash
# Clone du repository
git clone https://github.com/pixelea-fr/up-open-graph.git

# Installation des dépendances de développement
npm install

# Watch pour le développement
npm run watch

# Build pour la production
npm run build
```

## 📋 Changelog

### Version 1.0.3 (2024-03-31)
- 🏗️ **Amélioration des types Schema.org**
  - Ajout de 25+ sous-types spécialisés
  - Organisation par catégories avec optgroups
  - Architecture & Bâtiment (ArchitecturalService, GeneralContractor, etc.)
  - Services Professionnels (LegalService, AccountingService, etc.)
  - Santé & Bien-être (Dentist, BeautySalon, FitnessCenter, etc.)
  - Commerce & Restauration (Bakery, CafeOrCoffeeShop, Hotel, etc.)
  - Éducation & Loisirs (EducationalOrganization, ArtGallery, etc.)
  - Normalisation des sous-types en type racine + `additionalType`

### Version 1.0.1 (2024-03-31)
- 📥 **Nouveau** : Import JSON Schema.org pour remplissage automatique des champs
  - Support des types LocalBusiness, Organization, Restaurant, Store, etc.
  - Mapping automatique complet (nom, URL, téléphone, adresse, coordonnées GPS, images)
  - Interface utilisateur avec zone de collage et auto-import

### Version 1.0.0 (2024-03-30)
- ✨ Version initiale
- 🌐 Support Open Graph complet
- 🐦 Integration Twitter Cards
- 🏗️ Schema.org JSON-LD
- 🎨 Interface admin moderne
- 🔧 Configuration flexible

## 📝 License

Ce plugin est sous licence **GPL-2.0+**. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

## 🙏 Crédits

- **Développement** : [GEHIN Nicolas](https://pixelea.fr)
- **Design** : Équipe UI/UX
- **Contributions** : Tous les contributeurs de la communauté


---

**⭐ Si ce plugin vous plaît, n'oubliez pas de laisser une note sur WordPress.org !**
