<template lang="pug">
  q-page(padding class="bg-grey-10 text-white")
    q-timeline(dark color="primary")
      q-timeline-entry(heading) About Phelsuma grandis

      q-timeline-entry(title="Context")
        div.
          Invasive species, such as the Madagascar giant day gecko (Phelsuma grandis),
          threaten native ecosystems. Island ecosystems, such as in Mauritius, are
          especially vulnerable, as they have evolved in relative isolation. In the
          Mascarenes, many animal and plant species have gone extinct since the arrival
          of humans on the islands. Habitat destruction and invasive species were, and
          still are among the main drivers of species extinction on the Mascarenes.
          Feral cats, dogs, and rats are a huge threat to native birds, reptiles, and
          plants: they feed on plant seeds and flowers, on eggs, and juvenile and adult
          animals.

      q-timeline-entry(title="History")
        div.
          In the 1990s, Phelsuma grandis arrived in Mauritius from Madagascar, most
          likely through the pet trade. Some of these geckos escaped, and have since
          established a population in Mauritius, which has been linked to a decrease in
          the population of endemic Phelsuma day geckos.

      q-timeline-entry(title="Current Situation")
        div.
          Mauritius has four endemic species of Phelsuma day geckos on its mainland: The
          Mauritius lowland forest day gecko (Phelsuma guimbeaui), the Mauritius upland
          forest day gecko (Phelsuma rosagularis), the Blue-tailed day gecko (Phelsuma
          cepediana), and the Mauritius ornate day gecko (Phelsuma ornata). These pretty
          and colorful geckos have important functions in the forest ecosystem: they are
          pollinators of often highly adapted flowers, they are predators if insects, and
          prey for endemic birds.

        div.
          As all of these beautiful geckos are endemic to Mauritius (meaning they only
          live in Mauritius), their populations are relatively small, and they are
          endangered. Phelsuma grandis, the invasive species from Madagascar, is a big
          threat for these endemic geckos, mainly because it is much bigger. It will thus
          compete with the endemic geckos for habitat, but also predate on them, and kill
          young endemic geckos.

      q-timeline-entry(title="Help us")
        div.
          Currently it is assumed that Phelsuma grandis’ populations mainly occur in the
          settled areas of Mauritius. However, should these populations start to spread
          into the forests, and infringe on the already sparse habitat of the other
          endemic day geckos, especially Phelsuma guimbeaui and rosagularis, the
          consequences for these species could be disastrous.

        div.
          This why we built this app, and why we need your help: monitoring Phelsuma
          grandis is the first step to protecting Mauritius’ precious endemic geckos. And
          in order to effectively protect them, we need to know if and where they are
          particularly threatened. Only then can countermeasures be planned effectively.
          Please help us to protect endemic geckos! If you see a Phelsuma grandis, report
          your observations here!

      q-timeline-entry(title="Attributions")
        ul
          li
            |Gecko icon made by <a href="https://www.flaticon.com/authors/smashicons" title="Smashicons">Smashicons</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>.
          li
            |Map tiles &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.


</template>

<script>
export default {
   name: 'About',
}
</script>

<style lang="stylus">
li a {
  color: $primary
}
</style>
