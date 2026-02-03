<template>
  <b-container class="py-4">
    <b-row align-h="center">
      <b-col cols="12" md="8" lg="5">
        <h2 class="mb-3">Registo (Docente)</h2>

        <b-card>
          <b-alert variant="danger" :show="!!error" class="mb-3">{{ error }}</b-alert>

          <b-form @submit.prevent="submit">
            <b-form-group label="Nome" label-for="nome">
              <b-form-input id="nome" v-model.trim="nome" required />
            </b-form-group>

            <b-form-group label="Email" label-for="email">
              <b-form-input id="email" v-model.trim="email" type="email" required />
            </b-form-group>

            <b-form-group label="Departamento" label-for="departamento">
              <b-form-input
                id="departamento"
                v-model.trim="departamento"
                placeholder="Ex.: Informática"
              />
            </b-form-group>

            <b-form-group label="Password" label-for="password" description="Mínimo 6 caracteres.">
              <b-form-input id="password" v-model="password" type="password" required />
            </b-form-group>

            <b-form-group label="Confirmar Password" label-for="password2">
              <b-form-input id="password2" v-model="password2" type="password" required />
            </b-form-group>

            <div class="d-flex flex-column flex-md-row justify-content-md-between align-items-md-center">
              <b-button variant="primary" type="submit" class="w-100 w-md-auto mb-2 mb-md-0" :disabled="loading">
                <b-spinner small v-if="loading" class="mr-2" />
                Criar conta
              </b-button>

              <router-link to="/login" class="text-center">Já tenho conta</router-link>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      nome: '',
      email: '',
      departamento: '', 
      password: '',
      password2: '',
      loading: false,
      error: ''
    };
  },
  methods: {
    async submit() {
      this.error = '';
      if (this.password !== this.password2) {
        this.error = 'As passwords não coincidem.';
        return;
      }
      if ((this.password || '').length < 6) {
        this.error = 'A password deve ter pelo menos 6 caracteres.';
        return;
      }
      this.loading = true;
      try {
        await this.$store.dispatch('auth/register', {
          nome: this.nome,
          email: this.email,
          password: this.password,
          departamento: this.departamento // enviar para API
        });
        this.$router.push('/minhas-propostas');
      } catch (e) {
        this.error =
          e.response && e.response.data && e.response.data.message
            ? e.response.data.message
            : 'Erro no registo.';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
