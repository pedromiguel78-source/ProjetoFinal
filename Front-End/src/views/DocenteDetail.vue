<template>
  <div>
    <b-button variant="link" @click="$router.back()">&larr; Voltar</b-button>
    <b-card>
      <h3 class="mb-2">{{ docente.nome }}</h3>
      <p class="mb-1"><strong>Email:</strong> {{ docente.email }}</p>
      <p class="mb-0"><strong>Departamento:</strong> {{ docente.departamento || '-' }}</p>
    </b-card>

    <!-- Se não for o próprio docente autenticado -->
    <b-alert v-if="!isOwner" show variant="info" class="mt-3">
      A lista de propostas é privada por defeito. Faça login para gerir as suas próprias propostas.
    </b-alert>

    <!-- Se for o próprio docente autenticado -->
    <b-alert v-else show variant="success" class="mt-3">
      Este é o seu perfil. Pode gerir as suas propostas em
      <router-link to="/minhas-propostas"><strong>Minhas Propostas</strong></router-link>.
    </b-alert>
  </div>
</template>

<script>
import http from '../api/http';

export default {
  data() {
    return { docente: {} };
  },
  computed: {
    isOwner() {
      const me = this.$store.getters['auth/docente'];
      return !!me && me.id === this.$route.params.id;
    }
  },
  async created() {
    try {
      const { data } = await http.get(`/docentes/${this.$route.params.id}`);
      this.docente = data;
    } catch (e) {
      this.$alert('Docente não encontrado.');
      this.$router.push('/');
    }
  }
};
</script>
