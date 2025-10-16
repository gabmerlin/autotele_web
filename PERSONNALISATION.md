# 🎨 Guide de personnalisation AutoTele 2.1.1

## 🔗 Configurer le lien de téléchargement

### Dans app/page.tsx

Recherchez les deux boutons de téléchargement et remplacez `href="#"` par votre lien réel :

**Ligne ~88 :**
```tsx
<a 
  href="#"  // ← Remplacez par votre lien de téléchargement
  className="btn-primary inline-block px-12 py-5..."
>
```

**Ligne ~268 :**
```tsx
<a 
  href="#"  // ← Remplacez par votre lien de téléchargement
  className="btn-primary inline-block px-12 py-5..."
>
```

---

## 📧 Modifier les coordonnées de contact

### Dans app/page.tsx (section Footer)

**Ligne ~322 environ :**
```tsx
<a href="mailto:support@autotele.app" className="hover:text-white transition-colors">
  📧 support@autotele.app
</a>
```

Remplacez `support@autotele.app` par votre email réel.

---

## 🎨 Changer les couleurs du thème

### Dans tailwind.config.js

```js
colors: {
  primary: '#0088cc',      // Bleu Telegram - Couleur principale
  secondary: '#64b5f6',    // Bleu clair - Couleur secondaire
  dark: '#1a1a2e',         // Presque noir - Texte sombre
  light: '#f8f9fa',        // Gris très clair - Fond clair
}
```

### Dans app/globals.css

Modifiez le gradient principal (ligne 16) :
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

Essayez d'autres gradients :
- Bleu océan : `linear-gradient(135deg, #0088cc 0%, #00bfff 100%)`
- Violet profond : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Vert menthe : `linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)`
- Orange sunset : `linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)`

---

## 🔤 Changer la police de caractères

### Actuelle : Poppins [[memory:8766552]]

### Dans app/layout.tsx

```tsx
import { Poppins } from 'next/font/google'

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

### Autres polices professionnelles :

**Montserrat (moderne et géométrique) :**
```tsx
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

**Raleway (élégante et fine) :**
```tsx
import { Raleway } from 'next/font/google'

const raleway = Raleway({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

**Outfit (moderne et dynamique) :**
```tsx
import { Outfit } from 'next/font/google'

const outfit = Outfit({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
})
```

N'oubliez pas de changer aussi la variable dans le `<body>` :
```tsx
<body className={outfit.className}>{children}</body>
```

---

## 📝 Modifier les textes

### Tous les textes sont dans app/page.tsx

Les sections à modifier :

1. **Ligne 12-49** : Données des fonctionnalités
2. **Ligne 51-76** : FAQ (questions/réponses)
3. **Ligne 78-87** : Liste des screenshots
4. **Ligne 91-113** : Header / Hero
5. **Ligne 116-143** : Section Fonctionnalités
6. **Ligne 146-191** : Section Sécurité
7. **Ligne 194-246** : Section Screenshots
8. **Ligne 249-284** : Section FAQ
9. **Ligne 287-335** : Section Téléchargement
10. **Ligne 338-399** : Footer

---

## 🖼️ Ajouter ou modifier des images

### Structure des images

Toutes les images doivent être dans le dossier **public/images/**

### Format recommandé
- PNG pour les captures d'écran
- WebP pour une meilleure compression
- JPG pour les photos

### Ajouter une nouvelle capture d'écran

Dans `app/page.tsx`, ajoutez dans le tableau `screenshots` (ligne ~78) :

```tsx
{ src: '/images/nouvelle-capture.png', title: 'Description' },
```

---

## 🌐 Configurer les métadonnées SEO

### Dans app/layout.tsx

```tsx
export const metadata: Metadata = {
  title: 'AutoTele 2.1.1 - Automatisation intelligente pour Telegram',
  description: 'Automatisez l\'envoi de vos messages Telegram en toute sécurité...',
  keywords: 'AutoTele, Telegram, automatisation, messages programmés, multicomptes',
}
```

Personnalisez :
- **title** : Apparaît dans l'onglet du navigateur et les résultats Google
- **description** : Résumé affiché dans les résultats de recherche
- **keywords** : Mots-clés pour le référencement (optionnel en 2024)

---

## 📊 Ajouter Google Analytics

### Dans app/layout.tsx

Ajoutez avant la balise `</head>` :

```tsx
<head>
  <link rel="icon" href="/icon.ico" />
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-XXXXXXXXXX');
      `,
    }}
  />
</head>
```

Remplacez `G-XXXXXXXXXX` par votre ID Google Analytics.

---

## 🔧 Modifier la configuration requise

### Dans app/page.tsx (section Téléchargement)

**Ligne ~302 environ :**

```tsx
<ul className="text-left max-w-md mx-auto space-y-2 text-gray-700">
  <li>• Windows 10 ou supérieur</li>
  <li>• 4 GB de RAM minimum</li>
  <li>• 200 MB d'espace disque</li>
  <li>• Connexion Internet active</li>
  <li>• Compte(s) Telegram valide(s)</li>
</ul>
```

---

## 🚀 Ajouter une nouvelle section

### Template de section

```tsx
<section className="section-container">
  <div className="bg-white rounded-3xl shadow-2xl p-10 md:p-16">
    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">
      Titre de la section
    </h2>
    
    <p className="text-center text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
      Sous-titre descriptif
    </p>
    
    {/* Votre contenu ici */}
  </div>
</section>
```

Ajoutez-le dans `app/page.tsx` entre deux sections existantes.

---

## 🎭 Modifier les animations

### Dans app/globals.css

**Animation fade-in (ligne 62) :**
```css
.fade-in {
  animation: fadeIn 0.8s ease-in;
}
```

Changez la durée : `0.8s` → `1.2s` pour plus lent, `0.4s` pour plus rapide

**Effet hover des cartes (ligne 24) :**
```css
.card-hover:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

Augmentez `-8px` à `-12px` pour un effet plus prononcé.

---

## 📱 Modifier la responsivité

### Breakpoints Tailwind

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Exemple d'utilisation

```tsx
<h1 className="text-3xl md:text-5xl lg:text-7xl">
  Titre responsive
</h1>
```

- Mobile : 3xl
- Tablette : 5xl
- Desktop : 7xl

---

## 🔄 Désactiver le mode export statique

Si vous voulez utiliser des fonctionnalités serveur de Next.js :

### Dans next.config.js

Supprimez ou commentez :
```js
// output: 'export',
```

---

## 💡 Conseils de personnalisation

1. **Testez en local** : Toujours vérifier vos modifications avec `npm run dev`
2. **Sauvegardez** : Faites des commits Git réguliers
3. **Restez cohérent** : Gardez le même style de couleurs et typographie
4. **Optimisez** : Compressez vos images avant de les ajouter
5. **Mobile first** : Testez toujours sur mobile en premier

---

**Besoin d'aide ?**

Consultez la documentation Next.js : https://nextjs.org/docs
Consultez Tailwind CSS : https://tailwindcss.com/docs

