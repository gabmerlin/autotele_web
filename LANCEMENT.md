# 🚀 Guide de lancement - AutoTele 2.1.1

## Démarrage immédiat

### 1. Lancer le serveur de développement

```bash
npm run dev
```

Le site sera accessible sur : **http://localhost:3000**

### 2. Build pour production

```bash
npm run build
```

Cela génère un site statique dans le dossier `out/` prêt pour le déploiement.

## 📋 Checklist avant déploiement

- [ ] Vérifier que toutes les images s'affichent correctement
- [ ] Tester la responsivité sur mobile/tablette/desktop
- [ ] Vérifier les liens de téléchargement
- [ ] Remplacer l'email de contact si nécessaire
- [ ] Tester la FAQ (accordéon)
- [ ] Vérifier les performances (Google Lighthouse)

## 🔧 Personnalisation

### Modifier le lien de téléchargement

Dans `app/page.tsx`, recherchez :
```tsx
<a href="#" className="btn-primary...">
```

Remplacez `#` par le lien réel de téléchargement de votre application.

### Modifier l'email de contact

Dans `app/page.tsx` (section Footer), recherchez :
```tsx
<a href="mailto:support@autotele.app"...>
```

Remplacez par votre email réel.

### Changer les couleurs du thème

Dans `tailwind.config.js`, modifiez les couleurs :
```js
colors: {
  primary: '#0088cc',    // Couleur principale
  secondary: '#64b5f6',  // Couleur secondaire
  dark: '#1a1a2e',       // Couleur sombre
  light: '#f8f9fa',      // Couleur claire
}
```

## 📱 Structure des sections

1. **Header** - Présentation + CTA principal
2. **Fonctionnalités** - 6 fonctionnalités clés
3. **Sécurité** - Explication du fonctionnement sécurisé
4. **Aperçu** - 9 captures d'écran de l'interface
5. **FAQ** - 6 questions/réponses
6. **Téléchargement** - CTA secondaire + config requise
7. **Footer** - Liens et contact

## 🎨 Contenu fourni

### Textes inclus :
✅ Titres et sous-titres accrocheurs
✅ Descriptions des fonctionnalités
✅ Section sécurité complète
✅ 6 questions FAQ avec réponses détaillées
✅ Call-to-action optimisés
✅ Footer avec liens de navigation

### Design :
✅ Design moderne gradient violet/bleu
✅ Animations au survol
✅ Responsive mobile-first
✅ Police Poppins professionnelle
✅ Icônes emoji pour meilleure lisibilité
✅ Galerie d'images interactive

## 🌐 Déploiement

### Option 1 : Vercel (recommandé)
```bash
npm install -g vercel
vercel
```

### Option 2 : Netlify
1. Drag & drop le dossier `out/` sur netlify.com
2. Ou connectez votre repo GitHub

### Option 3 : Hébergement classique
1. Uploadez le contenu du dossier `out/` sur votre serveur
2. Configurez votre serveur web pour servir les fichiers statiques

## 💡 Conseils

- **Performance** : Le site est déjà optimisé pour la vitesse
- **SEO** : Les métadonnées sont configurées dans `app/layout.tsx`
- **Analytics** : Ajoutez Google Analytics dans `app/layout.tsx` si besoin
- **Favicon** : Le fichier `icon.ico` est déjà configuré

## 🐛 Problèmes courants

**Les images ne s'affichent pas :**
- Vérifiez que les fichiers sont bien dans le dossier `images/`
- Vérifiez les noms de fichiers (attention aux espaces)

**Le site ne démarre pas :**
- Supprimez `node_modules/` et `.next/`
- Relancez `npm install`

**Erreurs TypeScript :**
- Vérifiez la version de Node.js (>= 18.17)
- Relancez `npm install`

## 📞 Support

Pour toute question technique sur le site web :
- Email : support@autotele.app
- Documentation : README.md

---

**Bon lancement ! 🚀**

