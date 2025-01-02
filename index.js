import express from 'express';
import path from 'path';
import browserSync from 'browser-sync';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import multer from 'multer';
import nodemailer from 'nodemailer';


// Nastavení multeru pro zpracování formulářových dat
const upload = multer();

// Získání aktuálního adresáře
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Nastavení Express.js serveru
const app = express();
let menuItems = [
    { name: 'Hovězí steak', description: 'Šťavnatý hovězí steak s grilovanou zeleninou a domácí omáčkou.', price: '450 Kč' },
    { name: 'Krémové risotto', description: 'Risotto s čerstvými houbami a parmazánem.', price: '320 Kč' },
    { name: 'Dezert: Čokoládový fondant', description: 'Teplý fondant s vanilkovou zmrzlinou.', price: '180 Kč' },
];

// Nastavení pro Express
app.set('view engine', 'ejs');
app.set('views', __dirname); // Nastavení pro kořenový adresář

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Statické soubory pro CSS, obrázky a další
app.use(express.static(path.join(__dirname))); // Kořenový adresář pro statické soubory
app.use(express.json()); // Přidá middleware pro JSON data

// Route pro hlavní stránku
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
});

// Route pro restauraci
app.get('/restaurace', (req, res) => {
    res.render('restaurace.ejs', { menuItems });
});

// Route pro administrátorskou stránku
app.get('/admin', (req, res) => {
    console.log("Accessing /admin route");
    res.render('admin.ejs', { menuItems });
});

// Přidání položky do menu
app.post('/admin/add', (req, res) => {
    console.log("Formulář pro přidání položky byl odeslán.");
    const { name, description, price } = req.body;
    menuItems.push({ name, description, price });
    console.log(menuItems);
    res.redirect('/admin');
});

app.post('/admin/delete', (req, res) => {
    console.log("Formulář pro odstranění položky byl odeslán.");
    const { index } = req.body;
    menuItems.splice(index, 1);
    console.log(menuItems);
    res.redirect('/admin');
});

app.post('/send-email', upload.none(), async (req, res) => {
    console.log('Přijatá data:', req.body); // Zkontroluje obsah dat

    const { jmeno, prijmeni, telefon, email, popis } = req.body;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'dodobatis@gmail.com',
            pass: 'caxn oxsu lhpb ogdb', // Použijte heslo aplikace
        },
    });

    const mailOptions = {
        from: 'dodobatis@gmail.com',
        to: 'dodobatis@gmail.com',
        subject: 'Nový formulář z webu',
        text: `
            Jméno: ${jmeno || 'Neuvedeno'}
            Příjmení: ${prijmeni || 'Neuvedeno'}
            Telefon: ${telefon || 'Neuvedeno'}
            Email: ${email || 'Neuvedeno'}
            Popis: ${popis || 'Neuvedeno'}
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'E-mail byl úspěšně odeslán.' });
    } catch (error) {
        console.error('Chyba při odesílání e-mailu:', error);
        res.status(500).json({ message: 'Chyba při odesílání e-mailu.' });
    }
});
app.listen(3000, () => {
    console.log('Server běží na http://localhost:3000');
});

// Inicializace BrowserSync pro hot reload
browserSync.init({
    proxy: 'http://localhost:3000', // Proxy pro tvůj Express server
    files: ['*.html', '*.css', '*.js'], // Sledování změn ve všech HTML, CSS a JS souborech
    open: false, // Otevře automaticky prohlížeč
    notify: false, // Skrytí notifikací v prohlížeči
});