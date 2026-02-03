<template>
  <b-container class="py-4">
    <b-button variant="link" class="mb-2" @click="$router.back()">&larr; Voltar</b-button>

    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="mb-0">Minhas Propostas</h2>
      <b-button variant="success" to="/propostas/nova">+ Nova</b-button>
    </div>

    <b-card class="mb-3">
      <b-row>
        <b-col cols="12" md="6">
          <b-form-group label="Pesquisar">
            <b-form-input v-model="q" placeholder="título, palavras-chave" />
          </b-form-group>
        </b-col>
        <b-col cols="12" md="6">
          <b-form-group label="Estado">
            <b-form-select v-model="estado" :options="estadoOptions" />
          </b-form-group>
        </b-col>
      </b-row>
    </b-card>

    <b-table striped hover :items="filtered" :fields="fields">
      <template #cell(palavrasChave)="data">
        <span v-for="(p, i) in data.item.palavrasChave" :key="i" class="badge badge-info mr-1">{{ p }}</span>
      </template>
      <template #cell(acoes)="data">
        <b-button size="sm" variant="outline-primary" :to="`/propostas/${data.item._id}`">Editar</b-button>
        <b-button size="sm" variant="outline-danger" class="ml-2" @click="confirmDelete(data.item)">Apagar</b-button>
      </template>
    </b-table>

    <p class="text-muted" v-if="loading">A carregar...</p>
  </b-container>
</template>

<script>
import http from '../api/http';

export default {
  data() {
    return {
      propostas: [],
      loading: false,
      q: '',
      estado: '',
      estadoOptions: [
        { value: '', text: 'Todos' },
        { value: 'rascunho', text: 'Rascunho' },
        { value: 'publicada', text: 'Publicada' },
        { value: 'arquivada', text: 'Arquivada' }
      ],
      fields: [
        { key: 'titulo', label: 'Título' },
        { key: 'estado', label: 'Estado' },
        { key: 'palavrasChave', label: 'Palavras-chave' },
        { key: 'updatedAt', label: 'Atualizada' },
        { key: 'acoes', label: 'Ações' }
      ]
    };
  },
  computed: {
    filtered() {
      const qq = this.q.trim().toLowerCase();
      return this.propostas
        .filter((p) => (this.estado ? p.estado === this.estado : true))
        .filter((p) => {
          if (!qq) return true;
          const blob = [p.titulo, ...(p.palavrasChave || [])].join(' ').toLowerCase();
          return blob.includes(qq);
        });
    }
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        const { data } = await http.get('/propostas/minhas');
        this.propostas = data;
      } catch (e) {
        this.$alert('Não foi possível obter as propostas.');
      } finally {
        this.loading = false;
      }
    },
    async confirmDelete(item) {
      const ok = await this.$confirm(`Apagar a proposta "${item.titulo}"?`);
      if (!ok) return;
      try {
        await http.delete(`/propostas/${item._id}`);
        this.$alert('Proposta apagada.');
        this.load();
      } catch (e) {
        this.$alert('Erro ao apagar proposta.');
      }
    }
  },
  created() {
    this.load();
  }
};
</script>
