<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand to="/">ProjetoFinal</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" />
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item to="/" exact>Docentes</b-nav-item>
          <b-nav-item v-if="isLoggedIn" to="/minhas-propostas">Minhas Propostas</b-nav-item>
          <b-nav-item v-if="isLoggedIn" to="/propostas/nova">Nova Proposta</b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!isLoggedIn" to="/login">Login</b-nav-item>
          <b-nav-item v-if="!isLoggedIn" to="/registo">Registo</b-nav-item>
          <b-nav-text v-else class="mr-3">Olá, {{ docenteNome }}</b-nav-text>
          <b-button v-if="isLoggedIn" size="sm" variant="outline-light" @click="doLogout">
            Logout
          </b-button>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <b-container class="mt-4">
      <router-view />
    </b-container>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$store.getters['auth/isLoggedIn'];
    },
    docenteNome() {
      const d = this.$store.getters['auth/docente'];
      return d ? d.nome : '';
    }
  },
  methods: {
    doLogout() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
    }
  }
};
</script>
