import express from 'express';
import bodyparser from 'body-parser';
import cookieSession from 'cookie-session';

import UsersRepo from './repositories/users';

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: ['tf2YN1uPWjHzPWhK3npE'],
  })
);

//SIGN-UP
app.get('/sign-up', (req, res, next) => {
  res.send(`
  <div>
  ${req.session!.userId ? `Your ID is: ${req.session!.userId}` : ''}
    <form method="POST">
        <input name="email" placeholder="email" type="email"/>
        <input name="password" placeholder="password" type="password"/>
        <input name="passwordConfirmation" placeholder="password confirmation" type="password"/>
        <button>Sign-Up</button>
    </form>
  </div>
  `);
});

app.post('/sign-up', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body;
  const isUserUsed = await UsersRepo.getOneBy({ email });

  if (isUserUsed) {
    return res.send('Email inm use');
  }

  if (password !== passwordConfirmation) {
    return res.send('Password must match');
  }

  const user = await UsersRepo.create({ email, password });

  if (req.session) req.session.userId = user.id;

  res.send(`Acount ${email} created`);
});

//LOGIN
app.get('/login', (req, res, next) => {
  res.send(`
    <div>
      <form method="POST">
          <input name="email" placeholder="email" type="email"/>
          <input name="password" placeholder="password" type="password"/>
          <button>Login</button>
      </form>
    </div>
    `);
});

app.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  const user = await UsersRepo.getOneBy({ email });

  if (!user) {
    return res.send('No acount with this email found');
  }

  if (!(await UsersRepo.passwordsMatch(user.password, password))) {
    return res.send('Invalide password');
  }

  if (req.session) req.session.userId = user.id;

  res.send("You're login!");
});

//LOGOUT

app.get('/logout', (req, res, next) => {
  req.session = null;
  res.send("You're logged out");
});

app.listen(3000, () => {
  console.log("À l'écoute boss!");
});
