/* =========================================================
   CONFIG — c'est ICI que tu personnalises tout.
   Aucune connaissance en code n'est nécessaire :
   remplace juste le texte entre guillemets " ".
   ========================================================= */

const CONFIG = {

  // Le prénom de ta copine. Laisse vide "" pour juste "mon amour".
  girlfriendName: "Faoziath",

  // Ta signature à la fin de la lettre.
  yourName: "Juvence 🥷🏽",

  // Le code secret à 4 chiffres (ici : ton année de naissance).
  passkey: "2004",

  // L'indice affiché au-dessus du clavier.
  passkeyHint: "Indice : Mon année de naissance 🥷🏽",

  // Le petit texte affiché sous "De moi à toi."
  introText: "Savoir que t'es mienne est un cadeau que je ne prends jamais pour acquis. Voilà encore un petit quelques choses que j'ai voulus éssayer pour te faire passer l'ennuis de ces journées ennuyeuses.",

  // La petite carte-citation avec les mots surlignés.
  // Entoure un mot de ** ** pour qu'il soit surligné (comme sur ta capture).
  // Une ligne = "\n" pour passer à la suivante.
  quoteText: "Dans ton **sourire**, j'ai trouvé ma **paix**.\nDans ton **corps**, j'ai trouvé mes **désirs**.",

  // La lettre d'amour (tape "\n\n" pour sauter une ligne si tu veux des paragraphes).
  letterText: "Ma petite princesse,\n\nJ'écris ces quelques mots simplement parce que tu occupes toutes mes pensées, comme toujours. Il suffit que je pense à ton sourire pour que mon cœur fasse un petit bond de joie. Je me surprends à sourire tout seul devant mon téléphone dès que ton nom apparaît en notif, et honnêtement, c'est mon moment préféré de la journée.\n\nT'as cette façon incroyable de rendre mes journées plus douces et plus lumineuses, simplement en existant. Merci pour chaque câlin, chaque dispute, et pour le bonheur tranquille de savoir que tu es à moi. Être avec toi est la plus belle chose qui me soit arrivée, et je me sens infiniment chanceux de tenir ta main et d'avancer dans la vie à tes côtés.\n\nN'oublie jamais à quel point tu m'es précieuse. Tu es ma personne préférée, mon présent, mon rêve que j'aimerais voir devenir réalité. Je t'aime plus que toutes les étoiles dans le ciel, bon y en a trop mais quand meme voilà et je compte les jours jusqu'à la prochaine fois où je pourrai te palper les seins.\n\nPour toujours et à jamais, ton namour et ton bébé qui sont tout à toi,",

  // La liste des photos de la galerie.
  // - Dépose tes fichiers dans le dossier assets/photos/
  // - Mets le nom exact du fichier dans "src"
  // - "caption" est optionnel (petite légende sous la photo)
  // Tu peux ajouter ou supprimer des lignes librement.
  photos: [
    { src: "photos/photo1.jpg", caption: "" },
    { src: "photos/photo2.jpg", caption: "" },
    { src: "photos/photo3.jpg", caption: "" },
    { src: "photos/photo4.jpg", caption: "" },
    { src: "photos/photo5.jpg", caption: "" },
    { src: "photos/photo6.jpg", caption: "" },
    { src: "photos/photo7.jpg", caption: "" },
    { src: "photos/photo8.jpg", caption: "" },
  ],

  // Vitesse d'écriture de la lettre (millisecondes par lettre).
  typingSpeed: 20,

  // Musique de fond (optionnelle). Dépose un fichier mp3 dans
  // audio/ et nomme-le exactement "background-music.mp3".
  // Si le fichier n'existe pas, le site fonctionne normalement sans musique.
};
