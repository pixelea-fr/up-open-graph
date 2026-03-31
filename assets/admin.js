/* UP Open Graph — Admin JS */
(function ($) {
  'use strict';

  const S = UP_OG.settings;
  let currentPanel = 'overview';

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const daysShort = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

  // ─── INIT ────────────────────────────────────────────
  $(document).ready(function () {
    renderApp();
    bindEvents();
    syncToggles();
    refreshPreviews();
    refreshSchema();
  });

  // ─── RENDER ─────────────────────────────────────────
  function renderApp() {
    const app = $('#up-og-app');
    app.html(`
      <div class="up-og-wrap">
        ${renderTopbar()}
        ${renderSidebar()}
        <main class="up-og-main">
          ${renderOverview()}
          ${renderOGPanel()}
          ${renderTwitterPanel()}
          ${renderSchemaPanel()}
          ${renderPreviewPanel()}
        </main>
      </div>
      <div class="up-og-toast" id="up-og-toast"></div>
    `);
    showPanel('overview');
  }

  function renderTopbar() {
    return `
      <header class="up-og-topbar">
        <div class="up-og-logo">
          <div class="up-og-logo-icon">🔗</div>
          <h1>UP Open Graph</h1>
        </div>
        <div class="up-og-topbar-actions">
          <button class="up-og-save-btn" id="up-og-save">
            <span class="save-icon">💾</span>
            <span class="save-text">Enregistrer</span>
          </button>
        </div>
      </header>`;
  }

  function renderSidebar() {
    return `
      <nav class="up-og-sidebar">
        <div class="up-og-sidebar-label">Navigation</div>
        <div class="up-og-nav-item active" data-panel="overview">
          <span class="nav-icon">📊</span> Vue d'ensemble
        </div>
        <div class="up-og-sidebar-label">Paramètres</div>
        <div class="up-og-nav-item" data-panel="og">
          <span class="nav-icon">🌐</span> Open Graph
          <div class="up-og-toggle-pill ${S.og_enabled == 1 ? 'on' : ''}" data-toggle="og_enabled" title="Activer/désactiver"></div>
        </div>
        <div class="up-og-nav-item" data-panel="twitter">
          <span class="nav-icon">𝕏</span> Twitter / X
          <div class="up-og-toggle-pill ${S.twitter_enabled == 1 ? 'on' : ''}" data-toggle="twitter_enabled"></div>
        </div>
        <div class="up-og-nav-item" data-panel="schema">
          <span class="nav-icon">🏗️</span> Schema.org
          <div class="up-og-toggle-pill ${S.schema_enabled == 1 ? 'on' : ''}" data-toggle="schema_enabled"></div>
        </div>
        <div class="up-og-sidebar-label">Résultat</div>
        <div class="up-og-nav-item" data-panel="preview">
          <span class="nav-icon">👁️</span> Aperçu
        </div>
      </nav>`;
  }

  function renderOverview() {
    const countEnabled = [S.og_enabled, S.twitter_enabled, S.schema_enabled].filter(v => v == 1).length;
    return `
      <div class="up-og-panel active" id="panel-overview">
        <div class="up-og-panel-header">
          <h2>Vue d'ensemble</h2>
          <p>Statut de votre configuration Open Graph & Schema</p>
        </div>
        <div class="up-og-stats">
          <div class="up-og-stat-card">
            <div class="up-og-stat-value green">${countEnabled}/3</div>
            <div class="up-og-stat-label">Modules actifs</div>
          </div>
          <div class="up-og-stat-card">
            <div class="up-og-stat-value purple" id="stat-fields">—</div>
            <div class="up-og-stat-label">Champs renseignés</div>
          </div>
          <div class="up-og-stat-card">
            <div class="up-og-stat-value pink">${S.og_type || 'website'}</div>
            <div class="up-og-stat-label">Type OG actuel</div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">🔌 Modules</div>
          ${renderToggleRow('og_enabled', '🌐 Open Graph', 'Balises og:title, og:description, og:image...')}
          ${renderToggleRow('twitter_enabled', '𝕏 Twitter Cards', 'Balises twitter:card, twitter:title...')}
          ${renderToggleRow('schema_enabled', '🏗️ Schema.org JSON-LD', 'Données structurées LocalBusiness / Organization')}
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">📋 Code généré</div>
          <p style="color:var(--og-muted);font-size:13px;margin:0 0 12px;">Aperçu des balises insérées dans <code style="color:var(--og-accent);background:rgba(108,99,255,0.1);padding:2px 6px;border-radius:4px">&lt;head&gt;</code></p>
          <div class="up-og-schema-preview" id="overview-code-preview">
            <pre id="overview-code"></pre>
          </div>
        </div>
      </div>`;
  }

  function renderToggleRow(key, name, desc) {
    const on = S[key] == 1;
    return `
      <div class="up-og-toggle-wrap ${on ? 'enabled' : ''}" data-toggle-wrap="${key}" style="margin-bottom:8px">
        <div class="up-og-toggle-info">
          <div class="up-og-toggle-name">${name}</div>
          <div class="up-og-toggle-desc">${desc}</div>
        </div>
        <div class="up-og-switch ${on ? 'on' : ''}" data-switch="${key}"></div>
      </div>`;
  }

  function renderOGPanel() {
    return `
      <div class="up-og-panel" id="panel-og">
        <div class="up-og-panel-header">
          <h2>🌐 Open Graph</h2>
          <p>Métadonnées partagées sur Facebook, LinkedIn, WhatsApp...</p>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Informations principales</div>
          <div class="up-og-grid">
            <div class="up-og-field span-2">
              <label class="up-og-label">Titre par défaut</label>
              <input type="text" class="up-og-input up-og-live" data-key="og_title" value="${esc(S.og_title)}" placeholder="Nom de votre site">
            </div>
            <div class="up-og-field span-2">
              <label class="up-og-label">Description par défaut</label>
              <textarea class="up-og-textarea up-og-live" data-key="og_description" placeholder="Description de votre site">${esc(S.og_description)}</textarea>
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Nom du site</label>
              <input type="text" class="up-og-input up-og-live" data-key="og_site_name" value="${esc(S.og_site_name)}" placeholder="Mon Site">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Locale</label>
              <select class="up-og-select up-og-live" data-key="og_locale">
                ${optionLocale(S.og_locale)}
              </select>
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Type OG</label>
              <select class="up-og-select up-og-live" data-key="og_type">
                <option value="website" ${S.og_type==='website'?'selected':''}>website</option>
                <option value="article" ${S.og_type==='article'?'selected':''}>article</option>
                <option value="profile" ${S.og_type==='profile'?'selected':''}>profile</option>
                <option value="book" ${S.og_type==='book'?'selected':''}>book</option>
                <option value="product" ${S.og_type==='product'?'selected':''}>product</option>
                <option value="video.movie" ${S.og_type==='video.movie'?'selected':''}>video.movie</option>
                <option value="music.song" ${S.og_type==='music.song'?'selected':''}>music.song</option>
              </select>
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Facebook App ID</label>
              <input type="text" class="up-og-input up-og-live" data-key="fb_app_id" value="${esc(S.fb_app_id)}" placeholder="123456789">
            </div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Image par défaut</div>
          ${renderImagePicker('og_image', S.og_image, '📸')}
          <p style="color:var(--og-muted);font-size:12px;margin:12px 0 0;">Recommandé : 1200×630px. Sur les singles, la featured image sera utilisée en priorité.</p>
        </div>
      </div>`;
  }

  function renderTwitterPanel() {
    return `
      <div class="up-og-panel" id="panel-twitter">
        <div class="up-og-panel-header">
          <h2>𝕏 Twitter / X Cards</h2>
          <p>Apparence lors du partage sur Twitter / X</p>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Configuration Twitter</div>
          <div class="up-og-grid">
            <div class="up-og-field">
              <label class="up-og-label">Type de card</label>
              <select class="up-og-select up-og-live" data-key="twitter_card">
                <option value="summary" ${S.twitter_card==='summary'?'selected':''}>summary</option>
                <option value="summary_large_image" ${S.twitter_card==='summary_large_image'?'selected':''}>summary_large_image</option>
                <option value="app" ${S.twitter_card==='app'?'selected':''}>app</option>
                <option value="player" ${S.twitter_card==='player'?'selected':''}>player</option>
              </select>
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Compte Twitter (@)</label>
              <input type="text" class="up-og-input up-og-live" data-key="twitter_site" value="${esc(S.twitter_site)}" placeholder="moncompte">
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderSchemaPanel() {
    const hours = Array.isArray(S.schema_hours) ? S.schema_hours : [];
    return `
      <div class="up-og-panel" id="panel-schema">
        <div class="up-og-panel-header">
          <h2>🏗️ Schema.org JSON-LD</h2>
          <p>Données structurées pour les moteurs de recherche et agents IA</p>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Importer depuis JSON</div>
          <div class="up-og-field">
            <label class="up-og-label">Coller votre JSON Schema.org</label>
            <textarea class="up-og-textarea" id="up-og-json-import" placeholder='{"@context": "https://schema.org", "@type": "LocalBusiness", "name": "..."}' style="min-height: 120px; font-family: monospace; font-size: 12px;"></textarea>
          </div>
          <div class="up-og-actions" style="margin-top: 12px;">
            <button class="up-og-btn-outline" id="up-og-import-btn">📥 Importer les données</button>
            <button class="up-og-btn-outline up-og-btn-secondary" id="up-og-clear-import-btn" style="margin-left: 8px;">✕ Vider</button>
          </div>
          <p style="color:var(--og-muted);font-size:12px;margin-top:8px;">Supporte les types: LocalBusiness, Organization, Restaurant, Store, etc.</p>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Type de schema</div>
          <div class="up-og-grid">
            <div class="up-og-field span-2">
              <label class="up-og-label">@type</label>
              <select class="up-og-select up-og-live" data-key="schema_type" id="schema-type-select">
       <optgroup label="Général">
    <option value="Organization" ${S.schema_type==='Organization'?'selected':''}>Organization (Entreprise/Asso)</option>
    <option value="LocalBusiness" ${S.schema_type==='LocalBusiness'?'selected':''}>LocalBusiness (Commerce local)</option>
    <option value="Person" ${S.schema_type==='Person'?'selected':''}>Person (Indépendant/Blogueur)</option>
  </optgroup>

  <optgroup label="Architecture & Bâtiment">
    <option value="ArchitecturalService" ${S.schema_type==='ArchitecturalService'?'selected':''}>ArchitecturalService (Cabinet d'Architecte)</option>
    <option value="HomeAndConstructionBusiness" ${S.schema_type==='HomeAndConstructionBusiness'?'selected':''}>HomeAndConstructionBusiness (BTP)</option>
    <option value="GeneralContractor" ${S.schema_type==='GeneralContractor'?'selected':''}>GeneralContractor (Maître d'œuvre)</option>
    <option value="HousePainter" ${S.schema_type==='HousePainter'?'selected':''}>HousePainter (Peintre)</option>
    <option value="PlumbingService" ${S.schema_type==='PlumbingService'?'selected':''}>PlumbingService (Plombier)</option>
    <option value="Electrician" ${S.schema_type==='Electrician'?'selected':''}>Electrician (Électricien)</option>
  </optgroup>

  <optgroup label="Services Professionnels">
    <option value="ProfessionalService" ${S.schema_type==='ProfessionalService'?'selected':''}>ProfessionalService (Générique)</option>
    <option value="LegalService" ${S.schema_type==='LegalService'?'selected':''}>LegalService (Avocat/Notaire)</option>
    <option value="AccountingService" ${S.schema_type==='AccountingService'?'selected':''}>AccountingService (Comptable)</option>
    <option value="RealEstateAgent" ${S.schema_type==='RealEstateAgent'?'selected':''}>RealEstateAgent (Agent Immobilier)</option>
    <option value="ConsultingService" ${S.schema_type==='ConsultingService'?'selected':''}>ConsultingService (Conseil/Audit)</option>
  </optgroup>

  <optgroup label="Santé & Bien-être">
    <option value="MedicalBusiness" ${S.schema_type==='MedicalBusiness'?'selected':''}>MedicalBusiness (Cabinet médical)</option>
    <option value="Dentist" ${S.schema_type==='Dentist'?'selected':''}>Dentist (Dentiste)</option>
    <option value="HealthAndBeautyBusiness" ${S.schema_type==='HealthAndBeautyBusiness'?'selected':''}>HealthAndBeautyBusiness (Institut/Spa)</option>
    <option value="BeautySalon" ${S.schema_type==='BeautySalon'?'selected':''}>BeautySalon (Salon de coiffure)</option>
    <option value="FitnessCenter" ${S.schema_type==='FitnessCenter'?'selected':''}>FitnessCenter (Salle de sport)</option>
  </optgroup>

  <optgroup label="Commerce & Restauration">
    <option value="Store" ${S.schema_type==='Store'?'selected':''}>Store (Boutique/Magasin)</option>
    <option value="Restaurant" ${S.schema_type==='Restaurant'?'selected':''}>Restaurant</option>
    <option value="Bakery" ${S.schema_type==='Bakery'?'selected':''}>Bakery (Boulangerie)</option>
    <option value="CafeOrCoffeeShop" ${S.schema_type==='CafeOrCoffeeShop'?'selected':''}>CafeOrCoffeeShop</option>
    <option value="Hotel" ${S.schema_type==='Hotel'?'selected':''}>Hotel (Hébergement)</option>
  </optgroup>

  <optgroup label="Éducation & Loisirs">
    <option value="EducationalOrganization" ${S.schema_type==='EducationalOrganization'?'selected':''}>EducationalOrganization (École/Formation)</option>
    <option value="ArtGallery" ${S.schema_type==='ArtGallery'?'selected':''}>ArtGallery (Galerie d'Art)</option>
    <option value="EntertainmentBusiness" ${S.schema_type==='EntertainmentBusiness'?'selected':''}>EntertainmentBusiness (Loisirs)</option>
  </optgroup>
              </select>
            </div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Identité</div>
          <div class="up-og-grid">
            <div class="up-og-field">
              <label class="up-og-label">Nom</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_name" value="${esc(S.schema_name)}">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">URL</label>
              <input type="url" class="up-og-input up-og-live" data-key="schema_url" value="${esc(S.schema_url)}">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Téléphone</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_telephone" value="${esc(S.schema_telephone)}" placeholder="+33 1 23 45 67 89">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Email</label>
              <input type="email" class="up-og-input up-og-live" data-key="schema_email" value="${esc(S.schema_email)}" placeholder="contact@site.fr">
            </div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Adresse</div>
          <div class="up-og-grid cols-3">
            <div class="up-og-field span-3">
              <label class="up-og-label">Rue</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_street" value="${esc(S.schema_street)}" placeholder="12 rue de la Paix">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Ville</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_city" value="${esc(S.schema_city)}" placeholder="Paris">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Code postal</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_zip" value="${esc(S.schema_zip)}" placeholder="75001">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Pays (code ISO)</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_country" value="${esc(S.schema_country)}" placeholder="FR" maxlength="2">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Latitude</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_lat" value="${esc(S.schema_lat)}" placeholder="48.8698">
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Longitude</label>
              <input type="text" class="up-og-input up-og-live" data-key="schema_lng" value="${esc(S.schema_lng)}" placeholder="2.3311">
            </div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Images</div>
          <div class="up-og-grid">
            <div class="up-og-field">
              <label class="up-og-label">Logo</label>
              ${renderImagePicker('schema_logo', S.schema_logo, '🏷️')}
            </div>
            <div class="up-og-field">
              <label class="up-og-label">Image principale</label>
              ${renderImagePicker('schema_image', S.schema_image, '🖼️')}
            </div>
          </div>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Horaires d'ouverture</div>
          <div id="up-og-hours-wrap">
            ${renderHoursTable(hours)}
          </div>
          <button class="up-og-add-hours" id="up-og-add-hours">+ Ajouter une plage horaire</button>
        </div>
        <div class="up-og-card">
          <div class="up-og-card-title">Aperçu JSON-LD</div>
          <div class="up-og-schema-preview">
            <pre id="schema-preview-code">Chargement...</pre>
          </div>
        </div>
      </div>`;
  }

  function renderHoursTable(hours) {
    if (!hours.length) return '<p style="color:var(--og-muted);font-size:13px;margin:0">Aucune plage horaire définie.</p>';
    return `<table class="up-og-hours-table">
      <thead><tr>
        <th>Jours</th>
        <th>Ouverture</th>
        <th>Fermeture</th>
        <th></th>
      </tr></thead>
      <tbody id="up-og-hours-body">
        ${hours.map((h, i) => renderHoursRow(h, i)).join('')}
      </tbody>
    </table>`;
  }

  function renderHoursRow(h, i) {
    const selectedDays = Array.isArray(h.days) ? h.days : [];
    return `<tr data-hour-index="${i}">
      <td>
        <div class="up-og-days-wrap">
          ${days.map((d, di) => `<span class="up-og-day-chip ${selectedDays.includes(d)?'selected':''}" data-day="${d}">${daysShort[di]}</span>`).join('')}
        </div>
      </td>
      <td><input type="time" class="up-og-input" style="width:100px" value="${h.opens||'09:00'}"></td>
      <td><input type="time" class="up-og-input" style="width:100px" value="${h.closes||'18:00'}"></td>
      <td><button class="up-og-hours-row-remove" data-remove-hour="${i}">✕</button></td>
    </tr>`;
  }

  function renderPreviewPanel() {
    return `
      <div class="up-og-panel" id="panel-preview">
        <div class="up-og-panel-header">
          <h2>👁️ Aperçu</h2>
          <p>Rendu de vos métadonnées sur les différentes plateformes</p>
        </div>
        <div class="up-og-preview-tabs">
          <button class="up-og-preview-tab active" data-preview-tab="fb">Facebook</button>
          <button class="up-og-preview-tab" data-preview-tab="twitter">Twitter / X</button>
          <button class="up-og-preview-tab" data-preview-tab="google">Google</button>
        </div>
        <div class="up-og-preview-pane active" id="preview-fb">
          <div class="og-preview-fb">
            <div class="fb-image" id="prev-fb-image"><span>📸</span></div>
            <div class="fb-body">
              <div class="fb-domain" id="prev-fb-domain">votresite.fr</div>
              <div class="fb-title" id="prev-fb-title">Titre de la page</div>
              <div class="fb-desc" id="prev-fb-desc">Description de la page</div>
            </div>
          </div>
        </div>
        <div class="up-og-preview-pane" id="preview-twitter">
          <div class="og-preview-twitter">
            <div class="tw-image" id="prev-tw-image"><span>📸</span></div>
            <div class="tw-body">
              <div class="tw-title" id="prev-tw-title">Titre</div>
              <div class="tw-desc" id="prev-tw-desc">Description</div>
              <div class="tw-domain">🔗 <span id="prev-tw-domain">votresite.fr</span></div>
            </div>
          </div>
        </div>
        <div class="up-og-preview-pane" id="preview-google">
          <div class="og-preview-google">
            <div class="g-url" id="prev-g-url">https://votresite.fr</div>
            <div class="g-title" id="prev-g-title">Titre — Site</div>
            <div class="g-desc" id="prev-g-desc">Description</div>
          </div>
        </div>
      </div>`;
  }

  // ─── IMAGE PICKER ─────────────────────────────────────
  function renderImagePicker(key, value, icon) {
    const hasImage = value && value.length > 0;
    return `
      <div class="up-og-image-field" data-image-field="${key}">
        <div class="up-og-image-preview" id="img-preview-${key}">
          ${hasImage ? `<img src="${esc(value)}" alt="">` : `<span>${icon}</span>`}
        </div>
        <div class="up-og-image-actions">
          <input type="hidden" class="up-og-live" data-key="${key}" value="${esc(value)}">
          <button class="up-og-btn-outline up-og-media-picker" data-target="${key}">📁 Choisir une image</button>
          ${hasImage ? `<button class="up-og-btn-danger up-og-image-clear" data-target="${key}">✕ Supprimer</button>` : ''}
          ${hasImage ? `<small style="color:var(--og-muted);font-size:11px;word-break:break-all">${value}</small>` : ''}
        </div>
      </div>`;
  }

  // ─── EVENTS ───────────────────────────────────────────
  function bindEvents() {

    // Nav
    $(document).on('click', '.up-og-nav-item', function (e) {
      if ($(e.target).closest('.up-og-toggle-pill').length) return;
      const panel = $(this).data('panel');
      if (panel) showPanel(panel);
    });

    // Save
    $(document).on('click', '#up-og-save', saveSettings);

    // Live preview sync
    $(document).on('input change', '.up-og-live', function () {
      const key = $(this).data('key');
      S[key] = $(this).val();
      refreshPreviews();
      if ($(this).closest('#panel-schema').length) refreshSchema();
    });

    // Sidebar toggle pills
    $(document).on('click', '.up-og-toggle-pill', function (e) {
      e.stopPropagation();
      const key = $(this).data('toggle');
      S[key] = S[key] == 1 ? 0 : 1;
      $(this).toggleClass('on', S[key] == 1);
      syncToggles();
      updateOverviewStats();
    });

    // Overview switches
    $(document).on('click', '.up-og-switch', function () {
      const key = $(this).data('switch');
      S[key] = S[key] == 1 ? 0 : 1;
      $(this).toggleClass('on', S[key] == 1);
      $(this).closest('.up-og-toggle-wrap').toggleClass('enabled', S[key] == 1);
      $('[data-toggle="'+key+'"]').toggleClass('on', S[key] == 1);
      updateOverviewStats();
    });

    // Media picker
    $(document).on('click', '.up-og-media-picker', function (e) {
      e.preventDefault();
      const target = $(this).data('target');
      const frame = wp.media({
        title: 'Choisir une image',
        button: { text: 'Utiliser cette image' },
        multiple: false
      });
      frame.on('select', function () {
        const attachment = frame.state().get('selection').first().toJSON();
        const url = attachment.url;
        S[target] = url;
        $(`[data-key="${target}"]`).val(url);
        $(`#img-preview-${target}`).html(`<img src="${esc(url)}" alt="">`);
        refreshPreviews();
        if (['schema_logo','schema_image'].includes(target)) refreshSchema();
      });
      frame.open();
    });

    // Clear image
    $(document).on('click', '.up-og-image-clear', function () {
      const target = $(this).data('target');
      S[target] = '';
      $(`[data-key="${target}"]`).val('');
      $(`#img-preview-${target}`).html('<span>📸</span>');
      $(this).closest('.up-og-image-field').find('.up-og-btn-danger, small').remove();
      refreshPreviews();
    });

    // Preview tabs
    $(document).on('click', '.up-og-preview-tab', function () {
      $('.up-og-preview-tab').removeClass('active');
      $('.up-og-preview-pane').removeClass('active');
      $(this).addClass('active');
      const tab = $(this).data('preview-tab');
      $(`#preview-${tab}`).addClass('active');
    });

    // Add hours row
    $(document).on('click', '#up-og-add-hours', function () {
      const newHour = { days: ['Monday'], opens: '09:00', closes: '18:00' };
      if (!Array.isArray(S.schema_hours)) S.schema_hours = [];
      S.schema_hours.push(newHour);
      rerenderHours();
    });

    // Remove hours row
    $(document).on('click', '[data-remove-hour]', function () {
      const i = parseInt($(this).data('remove-hour'));
      S.schema_hours.splice(i, 1);
      rerenderHours();
    });

    // Day chip toggle
    $(document).on('click', '.up-og-day-chip', function () {
      const day = $(this).data('day');
      const row = $(this).closest('tr');
      const i = parseInt(row.data('hour-index'));
      if (!Array.isArray(S.schema_hours[i].days)) S.schema_hours[i].days = [];
      const idx = S.schema_hours[i].days.indexOf(day);
      if (idx >= 0) {
        S.schema_hours[i].days.splice(idx, 1);
        $(this).removeClass('selected');
      } else {
        S.schema_hours[i].days.push(day);
        $(this).addClass('selected');
      }
      refreshSchema();
    });

    // Hours time change
    $(document).on('change', '#up-og-hours-body input[type="time"]', function () {
      const row = $(this).closest('tr');
      const i = parseInt(row.data('hour-index'));
      const cells = row.find('input[type="time"]');
      S.schema_hours[i].opens = $(cells[0]).val();
      S.schema_hours[i].closes = $(cells[1]).val();
      refreshSchema();
    });

    // Schema type change
    $(document).on('change', '#schema-type-select', function () {
      refreshSchema();
    });

    // JSON Import
    $(document).on('click', '#up-og-import-btn', function () {
      importFromJSON();
    });

    $(document).on('click', '#up-og-clear-import-btn', function () {
      $('#up-og-json-import').val('');
    });

    // Auto-import on paste
    $(document).on('paste', '#up-og-json-import', function (e) {
      setTimeout(() => {
        importFromJSON();
      }, 100);
    });
  }

  function rerenderHours() {
    const hours = Array.isArray(S.schema_hours) ? S.schema_hours : [];
    $('#up-og-hours-wrap').html(renderHoursTable(hours));
    refreshSchema();
  }

  // ─── JSON IMPORT ─────────────────────────────────────
  function importFromJSON() {
    const jsonText = $('#up-og-json-import').val().trim();
    if (!jsonText) {
      showToast('✕ Collez d\'abord un JSON valide', 'error');
      return;
    }

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (e) {
      showToast('✕ JSON invalide : ' + e.message, 'error');
      return;
    }

    // Mapping des champs Schema.org vers les champs du plugin
    const mapping = {
      // Type
      '@type': 'schema_type',
      
      // Identité
      'name': 'schema_name',
      'url': 'schema_url',
      'telephone': 'schema_telephone',
      'email': 'schema_email',
      
      // Logo et image
      'logo': 'schema_logo',
      'image': 'schema_image',
    };

    // Mapping simple
    Object.keys(mapping).forEach(schemaKey => {
      if (data[schemaKey] !== undefined && data[schemaKey] !== null) {
        const pluginKey = mapping[schemaKey];
        S[pluginKey] = String(data[schemaKey]);
        $(`[data-key="${pluginKey}"]`).val(S[pluginKey]).trigger('change');
      }
    });

    // Adresse (nested object)
    if (data.address && typeof data.address === 'object') {
      if (data.address.streetAddress) {
        S.schema_street = String(data.address.streetAddress);
        $(`[data-key="schema_street"]`).val(S.schema_street).trigger('change');
      }
      if (data.address.addressLocality) {
        S.schema_city = String(data.address.addressLocality);
        $(`[data-key="schema_city"]`).val(S.schema_city).trigger('change');
      }
      if (data.address.postalCode) {
        S.schema_zip = String(data.address.postalCode);
        $(`[data-key="schema_zip"]`).val(S.schema_zip).trigger('change');
      }
      if (data.address.addressCountry) {
        S.schema_country = String(data.address.addressCountry);
        $(`[data-key="schema_country"]`).val(S.schema_country).trigger('change');
      }
    }

    // Coordonnées géo (nested object)
    if (data.geo && typeof data.geo === 'object') {
      if (data.geo.latitude !== undefined) {
        S.schema_lat = String(data.geo.latitude);
        $(`[data-key="schema_lat"]`).val(S.schema_lat).trigger('change');
      }
      if (data.geo.longitude !== undefined) {
        S.schema_lng = String(data.geo.longitude);
        $(`[data-key="schema_lng"]`).val(S.schema_lng).trigger('change');
      }
    }

    // Mise à jour de l'image preview
    if (S.schema_logo) {
      $(`#img-preview-schema_logo`).html(`<img src="${esc(S.schema_logo)}" alt="">`);
      const logoField = $(`[data-image-field="schema_logo"]`);
      if (!logoField.find('.up-og-btn-danger').length) {
        logoField.find('.up-og-image-actions').append(`
          <button class="up-og-btn-danger up-og-image-clear" data-target="schema_logo">✕ Supprimer</button>
          <small style="color:var(--og-muted);font-size:11px;word-break:break-all">${S.schema_logo}</small>
        `);
      }
    }

    if (S.schema_image) {
      $(`#img-preview-schema_image`).html(`<img src="${esc(S.schema_image)}" alt="">`);
      const imageField = $(`[data-image-field="schema_image"]`);
      if (!imageField.find('.up-og-btn-danger').length) {
        imageField.find('.up-og-image-actions').append(`
          <button class="up-og-btn-danger up-og-image-clear" data-target="schema_image">✕ Supprimer</button>
          <small style="color:var(--og-muted);font-size:11px;word-break:break-all">${S.schema_image}</small>
        `);
      }
    }

    // Refresh previews
    refreshSchema();
    refreshPreviews();
    updateOverviewStats();

    showToast('✓ Données importées avec succès', 'success');
  }

  // ─── PANEL SWITCH ─────────────────────────────────────
  function showPanel(name) {
    currentPanel = name;
    $('.up-og-panel').removeClass('active');
    $(`#panel-${name}`).addClass('active');
    $('.up-og-nav-item').removeClass('active');
    $(`.up-og-nav-item[data-panel="${name}"]`).addClass('active');
    if (name === 'preview') refreshPreviews();
    if (name === 'schema') refreshSchema();
    if (name === 'overview') { updateOverviewStats(); renderOverviewCode(); }
  }

  // ─── SYNC TOGGLES ─────────────────────────────────────
  function syncToggles() {
    ['og', 'twitter', 'schema'].forEach(f => {
      const on = S[f + '_enabled'] == 1;
      $(`[data-toggle="${f}_enabled"]`).toggleClass('on', on);
      $(`[data-switch="${f}_enabled"]`).toggleClass('on', on);
      $(`[data-switch="${f}_enabled"]`).closest('.up-og-toggle-wrap').toggleClass('enabled', on);
    });
  }

  function updateOverviewStats() {
    const count = ['og_enabled','twitter_enabled','schema_enabled'].filter(k => S[k] == 1).length;
    const vals = Object.values(S).filter(v => v && v !== '' && v !== '0' && v !== 0).length;
    $('.up-og-stats .up-og-stat-value.green').text(count + '/3');
    $('#stat-fields').text(vals);
  }

  // ─── PREVIEW REFRESH ─────────────────────────────────
  function refreshPreviews() {
    const title = S.og_title || UP_OG.site_name;
    const desc  = S.og_description || '';
    const image = S.og_image || '';
    const siteUrl = UP_OG.site_url || '';
    const domain = siteUrl.replace(/https?:\/\//, '').replace(/\/$/, '');

    // Facebook
    if (image) {
      $('#prev-fb-image').html(`<img src="${esc(image)}" alt="">`);
    } else {
      $('#prev-fb-image').html('<span>📸</span>');
    }
    $('#prev-fb-title').text(title);
    $('#prev-fb-desc').text(desc);
    $('#prev-fb-domain').text(domain.toUpperCase());

    // Twitter
    if (image && S.twitter_card === 'summary_large_image') {
      $('#prev-tw-image').html(`<img src="${esc(image)}" alt="">`);
    } else {
      $('#prev-tw-image').html('<span>📸</span>');
    }
    $('#prev-tw-title').text(title);
    $('#prev-tw-desc').text(desc);
    $('#prev-tw-domain').text(domain);

    // Google
    $('#prev-g-url').text(siteUrl);
    $('#prev-g-title').text(title + ' — ' + domain);
    $('#prev-g-desc').text(desc);
  }

  // ─── SCHEMA REFRESH ──────────────────────────────────
  function refreshSchema() {
    const data = collectFormData();
    $.post(UP_OG.ajax_url, {
      action: 'up_og_preview',
      nonce: UP_OG.nonce,
      schema_type: data.schema_type,
    }, function (res) {
      if (res.success) {
        $('#schema-preview-code').html(syntaxHighlight(res.data.schema));
      }
    });
  }

  function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? 'json-key' : 'json-string';
      } else if (/true|false/.test(match)) {
        cls = 'json-bool';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }

  // ─── OVERVIEW CODE ────────────────────────────────────
  function renderOverviewCode() {
    const lines = [];
    if (S.og_enabled == 1) {
      lines.push('<span style="color:#6b6b80"><!-- Open Graph --></span>');
      lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">property</span>=<span style="color:#fca5a5">"og:title"</span> content=<span style="color:#fca5a5">"${esc(S.og_title)}"</span>&gt;`);
      lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">property</span>=<span style="color:#fca5a5">"og:type"</span> content=<span style="color:#fca5a5">"${esc(S.og_type)}"</span>&gt;`);
      lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">property</span>=<span style="color:#fca5a5">"og:description"</span> content=<span style="color:#fca5a5">"${esc(S.og_description)}"</span>&gt;`);
      if (S.og_image) lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">property</span>=<span style="color:#fca5a5">"og:image"</span> content=<span style="color:#fca5a5">"..."</span>&gt;`);
    }
    if (S.twitter_enabled == 1) {
      lines.push('');
      lines.push('<span style="color:#6b6b80"><!-- Twitter Cards --></span>');
      lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">name</span>=<span style="color:#fca5a5">"twitter:card"</span> content=<span style="color:#fca5a5">"${esc(S.twitter_card)}"</span>&gt;`);
      lines.push(`<span style="color:#7dd3fc">&lt;meta</span> <span style="color:#86efac">name</span>=<span style="color:#fca5a5">"twitter:title"</span> content=<span style="color:#fca5a5">"${esc(S.og_title)}"</span>&gt;`);
    }
    if (S.schema_enabled == 1) {
      lines.push('');
      lines.push('<span style="color:#6b6b80"><!-- Schema JSON-LD --></span>');
      lines.push(`<span style="color:#7dd3fc">&lt;script</span> <span style="color:#86efac">type</span>=<span style="color:#fca5a5">"application/ld+json"</span><span style="color:#7dd3fc">&gt;</span>{ "@type": "${esc(S.schema_type)}", ... }<span style="color:#7dd3fc">&lt;/script&gt;</span>`);
    }
    if (!lines.length) lines.push('<span style="color:var(--og-muted)">Aucun module activé.</span>');
    $('#overview-code').html(lines.join('\n'));
  }

  // ─── SAVE ─────────────────────────────────────────────
  function saveSettings() {
    const $btn = $('#up-og-save');
    $btn.addClass('saving').find('.save-text').text('Sauvegarde...');

    const data = collectFormData();
    data.action = 'up_og_save';
    data.nonce  = UP_OG.nonce;

    // Send hours as serializable format
    data.schema_hours = JSON.stringify(S.schema_hours || []);

    $.post(UP_OG.ajax_url, data, function (res) {
      $btn.removeClass('saving').find('.save-text').text('Enregistrer');
      if (res.success) {
        showToast('✓ ' + res.data.message, 'success');
        // Refresh the page to ensure all settings are properly reloaded
        setTimeout(() => {
          location.reload();
        }, 1500);
      } else {
        showToast('✕ Erreur lors de la sauvegarde', 'error');
      }
    }).fail(function () {
      $btn.removeClass('saving').find('.save-text').text('Enregistrer');
      showToast('✕ Erreur réseau', 'error');
    });
  }

  function collectFormData() {
    const data = {};
    // Collect all live fields
    $('.up-og-live').each(function () {
      const key = $(this).data('key');
      if (key) data[key] = $(this).val();
    });
    // Toggles
    data.og_enabled      = S.og_enabled;
    data.twitter_enabled = S.twitter_enabled;
    data.schema_enabled  = S.schema_enabled;
    data.schema_hours    = S.schema_hours || [];
    return data;
  }

  // ─── TOAST ─────────────────────────────────────────────
  function showToast(msg, type = 'success') {
    const $t = $('#up-og-toast');
    $t.text(msg).removeClass('success error').addClass(type).addClass('show');
    setTimeout(() => $t.removeClass('show'), 3000);
  }

  // ─── HELPERS ──────────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function optionLocale(current) {
    const locales = [
      ['fr_FR','Français (France)'], ['en_US','English (US)'], ['en_GB','English (UK)'],
      ['de_DE','Deutsch'], ['es_ES','Español'], ['it_IT','Italiano'],
      ['pt_PT','Português'], ['nl_NL','Nederlands'], ['ar_AR','عربي'],
    ];
    return locales.map(([v, l]) => `<option value="${v}" ${current===v?'selected':''}>${l}</option>`).join('');
  }

})(jQuery);
