import React from "react";

const Advice = () => {
  return (
    <main>
      <h2>Conseils d'Écriture</h2>

      <section className="b-section">
        <article className="page-article">
          <p>
            Bienvenue sur notre page dédiée aux conseils d'écriture. Que vous
            soyez un écrivain chevronné ou un novice passionné, nous sommes
            ravis de partager des conseils qui vous aideront à affiner vos
            compétences littéraires, stimuler votre créativité et vous guider à
            travers le processus d'écriture. Explorez les suggestions ci-dessous
            pour enrichir votre parcours littéraire.
          </p>

          <h3>Conseils Vidéo : Des Experts Partagent Leurs Astuces</h3>
          <p>
            Dans cette vidéo inspirante, des experts littéraires chevronnés
            partagent leurs expériences et offrent des astuces pratiques pour
            vous aider à surmonter les blocages créatifs, à développer des
            intrigues captivantes et à donner vie à vos personnages. Découvrez
            des conseils d'écriture enrichissants qui transformeront votre
            approche de la création littéraire. Appuyez-vous sur l'expertise de
            ces professionnels pour perfectionner votre art et atteindre de
            nouveaux sommets dans votre aventure littéraire.
          </p>

          <iframe
            width="300"
            height="250"
            src="https://www.youtube.com/embed/8IMpXvpKXbA?si=OywIv7sZe5oWSR5r"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          ></iframe>
        </article>
      </section>
    </main>
  );
};

export default Advice;
