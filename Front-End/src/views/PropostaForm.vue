<template>
  <div>
    <b-button variant="link" @click="$router.back()">&larr; Voltar</b-button>
    <h2>{{ isEdit ? 'Editar Proposta' : 'Nova Proposta' }}</h2>

    <b-card>
      <b-form @submit.prevent="submit">
        <b-form-group label="Título">
          <b-form-input v-model="form.titulo" required />
        </b-form-group>

        <b-form-group label="Estado">
          <b-form-select v-model="form.estado" :options="estadoOptions" />
        </b-form-group>

        <b-form-group label="Coorientadores (opcional)">
          <b-form-select v-model="form.coorientadores" :options="docenteOptions" multiple />
          <small class="text-muted">O orientador é automaticamente o docente autenticado.</small>
        </b-form-group>

        <b-form-group label="Alunos (opcional)">
          <b-form-select v-model="form.alunos" :options="alunoOptions" multiple />
        </b-form-group>

        <b-form-group label="Palavras-chave">
          <div class="d-flex">
            <b-form-input v-model="novaPalavra" placeholder="ex.: full-stack" @keydown.enter.prevent="addPalavra" />
            <b-button class="ml-2" variant="outline-primary" @click="addPalavra">Adicionar</b-button>
          </div>
          <div class="mt-2">
            <span v-for="(p, i) in form.palavrasChave" :key="i" class="badge badge-info mr-2">
              {{ p }}
              <b-button size="sm" variant="link" class="p-0 ml-1" @click="removePalavra(i)">x</b-button>
            </span>
          </div>
          <small class="text-muted">Obrigatório (pelo menos 1).</small>
        </b-form-group>

        <b-form-group label="Descrição e objetivos">
          <b-form-textarea v-model="form.descricaoObjetivos" rows="6" required />
        </b-form-group>

        <div class="d-flex">
          <b-button type="submit" variant="success" :disabled="loading">
            {{ isEdit ? 'Guardar alterações' : 'Criar proposta' }}
          </b-button>
          <b-button v-if="isEdit" class="ml-2" variant="outline-danger" @click="apagar" :disabled="loading">
            Apagar
          </b-button>
        </div>
      </b-form>
    </b-card>
  </div>
</template>

<script>
import http from '../api/http';

export default {
  data() {
    return {
      loading: false,
      docentes: [],
      alunos: [],
      novaPalavra: '',
      estadoOptions: [
        { value: 'rascunho', text: 'Rascunho' },
        { value: 'publicada', text: 'Publicada' },
        { value: 'arquivada', text: 'Arquivada' }
      ],
      form: {
        titulo: '',
        estado: 'rascunho',
        coorientadores: [],
        alunos: [],
        palavrasChave: [],
        descricaoObjetivos: ''
      }
    };
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id;
    },
    docenteOptions() {
      const me = this.$store.getters['auth/docente'];
      return this.docentes
        .filter((d) => !me || d._id !== me.id)
        .map((d) => ({ value: d._id, text: `${d.nome} (${d.email})` }));
    },
    alunoOptions() {
      return this.alunos.map((a) => ({ value: a._id, text: `${a.nome} (#${a.numero})` }));
    }
  },
  methods: {
    addPalavra() {
      const p = this.novaPalavra.trim();
      if (!p) return;
      if (!this.form.palavrasChave.includes(p)) this.form.palavrasChave.push(p);
      this.novaPalavra = '';
    },
    removePalavra(i) {
      this.form.palavrasChave.splice(i, 1);
    },
    async carregarListas() {
      const [doc, alu] = await Promise.all([http.get('/docentes'), http.get('/alunos')]);
      this.docentes = doc.data;
      this.alunos = alu.data;
    },
    async carregarProposta() {
      const { data } = await http.get(`/propostas/${this.$route.params.id}`);
      this.form = {
        titulo: data.titulo,
        estado: data.estado,
        coorientadores: (data.coorientadores || []).map((d) => d._id),
        alunos: (data.alunos || []).map((a) => a._id),
        palavrasChave: data.palavrasChave || [],
        descricaoObjetivos: data.descricaoObjetivos
      };
    },
    async submit() {
      if (!this.form.palavrasChave.length) {
        this.$alert('Indique pelo menos uma palavra-chave.');
        return;
      }
      this.loading = true;
      try {
        if (this.isEdit) {
          await http.put(`/propostas/${this.$route.params.id}`, this.form);
          this.$alert('Proposta atualizada.');
        } else {
          await http.post('/propostas', this.form);
          this.$alert('Proposta criada.');
        }
        this.$router.push('/minhas-propostas');
      } catch (e) {
        const msg = e.response && e.response.data && e.response.data.message ? e.response.data.message : 'Erro a guardar.';
        this.$alert(msg);
      } finally {
        this.loading = false;
      }
    },
    async apagar() {
      const ok = await this.$confirm('Tem a certeza que quer apagar esta proposta?');
      if (!ok) return;
      this.loading = true;
      try {
        await http.delete(`/propostas/${this.$route.params.id}`);
        this.$alert('Proposta apagada.');
        this.$router.push('/minhas-propostas');
      } catch (e) {
        this.$alert('Erro ao apagar.');
      } finally {
        this.loading = false;
      }
    }
  },
  async created() {
    try {
      await this.carregarListas();
      if (this.isEdit) await this.carregarProposta();
    } catch (e) {
      this.$alert('Erro a carregar dados do formulário.');
    }
  }
};
</script>
