import http from '../../api/http';

const state = {
  token: localStorage.getItem('token') || '',
  docente: JSON.parse(localStorage.getItem('docente') || 'null')
};

const getters = {
  token: (s) => s.token,
  docente: (s) => s.docente,
  isLoggedIn: (s) => !!s.token
};

const mutations = {
  setAuth(state, { token, docente }) {
    state.token = token;
    state.docente = docente;
    localStorage.setItem('token', token);
    localStorage.setItem('docente', JSON.stringify(docente));
  },
  setDocente(state, docente) {
    state.docente = docente;
    localStorage.setItem('docente', JSON.stringify(docente));
  },
  clearAuth(state) {
    state.token = '';
    state.docente = null;
    localStorage.removeItem('token');
    localStorage.removeItem('docente');
  }
};

const actions = {
  async login({ commit }, { email, password }) {
    const { data } = await http.post('/auth/login', { email, password });
    commit('setAuth', data);
    return data; // ✅
  },

  async register({ commit }, { nome, email, password, departamento }) {
    const { data } = await http.post('/auth/register', {
      nome,
      email,
      password,
      departamento
    });
    commit('setAuth', data);
    return data;
  },

  async restore({ state, commit }) {
    if (!state.token) return;
    const { data } = await http.get('/auth/me');
    commit('setDocente', data.docente);
  },

  logout({ commit }) {
    commit('clearAuth');
  }
};

export default { namespaced: true, state, getters, mutations, actions };
