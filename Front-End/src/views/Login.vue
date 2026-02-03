<template>
  <b-container class="py-4">
    <b-row align-h="center">
      <b-col cols="12" md="8" lg="5">
    <h2>Login (Docente)</h2>
    <b-card>
      <b-form @submit.prevent="submit">
        <b-form-group label="Email">
          <b-form-input v-model="email" type="email" required />
        </b-form-group>
        <b-form-group label="Password">
          <b-form-input v-model="password" type="password" required />
        </b-form-group>
        <b-button type="submit" variant="primary" :disabled="loading">Entrar</b-button>
      </b-form>
    </b-card>
  <b-alert show variant="secondary" class="mt-3">
  <strong>Credenciais de demonstração:</strong><br />
  Email: <code>pedro.pereira@uab.pt</code><br />
  Password: <code>PWA2026!</code>
</b-alert>

        </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return { email: '', password: '', loading: false };
  },
 methods: {
  async submit() {
    console.log('SUBMIT chamado', this.email);
    this.loading = true;
    try {
      const res = await this.$store.dispatch('auth/login', {
        email: this.email,
        password: this.password
      });
      console.log('LOGIN OK', res);
      this.$router.replace('/minhas-propostas');

    } catch (e) {
      console.error('ERRO NO LOGIN', e);
      const msg =
        e.response && e.response.data && e.response.data.message
          ? e.response.data.message
          : 'Erro no login.';
      alert(msg);
    } finally {
      this.loading = false;
    }
  }
}

};
</script>
