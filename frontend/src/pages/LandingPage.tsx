// src/components/LandingPage.tsx
import React from 'react';
import './LandingPage.css'; // Make sure your CSS is imported
import BlantImage from '../../public/blant.png';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to the BLANT Web Interface</h1>

      <img
        src={BlantImage}
        alt="Network graph examples for BLANT"
        className="landing-image"
      />

      <div className="info-text">
        <p>
          BLANT stand for <a href="https://www.liebertpub.com/doi/abs/10.1089/cmb.2025.0095" target="_blank">Basic Local Alignment of Network Topology</a>.
          It is intended to form the basis of a seed-and-extend local alignment algorithm, but for networks: given an undirected network
          G, and a value of k, it samples connected k-node subgraphs called k-graphlets. Since the number of k-graphlets in a graph of n
          nodes is exponential in both k and n, BLANT does not exhaustively enumerate all k-graphlets, but instead samples them--either
          randomly as many as the user specifies, or deterministically using our own algorithm to create a index that can be used for
          actual local alignments.
          <br /><br />
          In the random case, uniform random sampling of k-graphlets is difficult, so there are several choices
          among sampling methods, each with different trade-offs. Finally, BLANT allows for several different methods of output: it can
          produce orbit-degree vectors (ODVs) like ORCA, or graphlet frequencies, or an explicit list of k-graphlets that can be used as
          seeds for later extension. At present, BLANT does not provide an "extend" functionality; there are many seed-and-extend local
          alignment algorithms in the literature, each with its own method of seeding and extending. Although BLANT currently is by far
          the fastest method of producing a large number of seeds, we have not yet tested how the various extend algorithms perform using
          our seeds; this is a clear area of future work, and suggestions are welcome. Despite the lack of an "extend" feature, BLANT is
          still capable of useful bioinformatics, as described in our tool paper in the journal Bioinformatics.
        </p>
        <p>
          The most recent version of BLANT is always available on <a href="https://github.com/waynebhayes/BLANT">GitHub</a>. <br />
        </p>
        <p>Our paper on BLANT is available <a href="https://www.liebertpub.com/doi/abs/10.1089/cmb.2025.0095" target="_blank">here</a>.</p>
      </div>
    </div>
  );
};

export default LandingPage;
