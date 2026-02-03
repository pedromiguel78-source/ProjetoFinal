<template>
  <div>
    <h2>Docentes</h2>
    <b-card class="mb-3">
      <b-form-group label="Pesquisar" label-for="q">
        <b-form-input id="q" v-model="q" placeholder="nome, email, departamento" />
      </b-form-group>
    </b-card>

    <b-table striped hover :items="filtered" :fields="fields">
      <template #cell(nome)="data">
        <router-link :to="linkDocente(data.item)">{{ data.item.nome }}</router-link>
      </template>
    </b-table>

    <p class="text-muted" v-if="loading">A carregar...</p>
  </div>
</template>

<script>
import http from '../api/http';

export default {
  data() {
    return {
      docentes: [],
      q: '',
      loading: false,
      fields: [
        { key: 'nome', label: 'Nome' },
        { key: 'email', label: 'Email' },
        { key: 'departamento', label: 'Departamento' }
      ]
    };
  },
  computed: {
    filtered() {
      const qq = this.q.trim().toLowerCase();
      if (!qq) return this.docentes;
      return this.docentes.filter((d) =>
        [d.nome, d.email, d.departamento].join(' ').toLowerCase().includes(qq)
      );
    },
    isLoggedIn() {
      return this.$store.getters['auth/isLoggedIn'];
    },
    currentDocente() {
      return this.$store.getters['auth/docente'];
    }
  },
  methods: {
    linkDocente(d) {
      // Se estiver autenticado e clicar no próprio nome -> ir para Minhas Propostas
      if (this.isLoggedIn && this.currentDocente && this.currentDocente.id === d._id) {
        return '/minhas-propostas';
      }
      // Caso contrário, vai para o detalhe do docente (público)
      return `/docentes/${d._id}`;
    }
  },
  async created() {
    this.loading = true;
    try {
      const { data } = await http.get('/docentes');
      this.docentes = data;
    } catch (e) {
      this.$alert('Não foi possível obter a lista de docentes.');
    } finally {
      this.loading = false;
    }
  }
};
</script>
