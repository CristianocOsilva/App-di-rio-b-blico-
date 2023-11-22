const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const sqlite3 = require('sqlite3');
const ejs = require('ejs');

const app = express();
const port = 4000

// Configuração do banco de dados SQLite
const db = new sqlite3.Database('diario.db');

// Configuração do EJS como mecanismo de visualização
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Configuração da sessão
app.use(session({ secret: 'secretpassword', resave: true, saveUninitialized: true }));

// Inicialização do Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuração das estratégias de autenticação

passport.use(new GitHubStrategy({
  clientID: 'seu-client-id',
  clientSecret: 'seu-client-secret',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Lógica de autenticação com o GitHub
  return done(null, profile);
}));

// Serialização do usuário para a sessão
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Rotas
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});


// Rota de autenticação com o GitHub
app.get('/auth/github',
  passport.authenticate('github')
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/');
  }
);

// Inicialização do servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
