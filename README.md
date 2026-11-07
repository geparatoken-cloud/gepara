<p align="center"><img src="avatar.jpg" width="120" alt="GETOKEN"></p>

<h1 align="center">GETOKEN · GEPARA</h1>
<p align="center"><b>Bir an. Bir parmak izi. Sonsuza kadar kanıt.</b><br>
<i>One moment. One fingerprint. Proof forever.</i></p>

<p align="center">
<a href="https://gepara.com/dosya-kaniti.html"><b>Dosya Kanıtı / File Proof</b></a> ·
<a href="https://gepara.com/defter.html">Açık Defter / Open Ledger</a> ·
<a href="https://gepara.com/seffaflik.html">Şeffaflık / Transparency</a>
</p>

---

## Türkçe

**Dosya Kanıtı**, bir dosyanın belirli bir tarihte sizde olduğunu ve o günden beri değişmediğini kanıtlamanın ücretsiz yoludur.

- **Ücretsiz, üyeliksiz.** Hesap, e-posta, telefon istemez.
- **Dosyanız cihazınızdan çıkmaz.** Tarayıcı yalnızca dosyanın SHA-256 parmak izini hesaplar.
- **Bitcoin'e işlenir.** Parmak izi, açık [OpenTimestamps](https://opentimestamps.org) sunucularına gönderilir ve birkaç saat içinde Bitcoin blokzincirine bağlanır. Kanıt (`.ots`) bu siteye bağlı değildir; site kapansa bile herkes bağımsız olarak doğrulayabilir.
- **Teslim paketi.** Ev, araç veya eşya teslimindeki fotoğrafları tek kanıtta toplar.

Kullanım örnekleri: kira depozitosu, araç kiralama hasarı, eser/tasarım sahipliği, teslim tutanağı fotoğrafları, sözleşme taslakları, keşif fotoğrafları.

**GEPARA kayıt sistemi**, uzmanların (ör. bilirkişi raporları) belge parmak izlerini Polygon ağına kaydetmesini ve herkesin bunları ücretsiz doğrulamasını sağlar. İlk gerçek kullanım: 2017–2026 arasına ait **2.622 bilirkişi belgesi**, 20 işlemde kaydedildi. Ayrıntılar ve canlı sayılar: [Açık Defter](https://gepara.com/defter.html).

## English

**File Proof** is a free way to prove a file was in your possession on a given date and has not changed since.

- **Free, no account.** No email, no phone number.
- **Your file never leaves your device.** The browser only computes the file's SHA-256 fingerprint.
- **Anchored in Bitcoin.** The fingerprint goes to public [OpenTimestamps](https://opentimestamps.org) calendars and is anchored in the Bitcoin blockchain within hours. The proof (`.ots`) does not depend on this site; anyone can verify it independently, even if the site disappears.
- **Handover pack.** Bundles check-in/check-out photos into a single proof.

**GEPARA registry** lets experts (e.g. technical expert reports) record document fingerprints on Polygon, and lets anyone verify them for free. First real use: **2,622 expert documents** from 2017–2026, recorded in 20 transactions. Live figures: [Open Ledger](https://gepara.com/defter.html).

---

## Contracts (Polygon, chain 137) — source verified on Polygonscan

| | Address |
|---|---|
| GEPARA token (fixed supply 1,000,000, no minting) | [`0xd88e494b914e6b70cee7f1f8ae92383bbb22c2e9`](https://polygonscan.com/address/0xd88e494b914e6b70cee7f1f8ae92383bbb22c2e9#code) |
| Report registry v1 | [`0xc6a4c5ec25f624729ccbdb0fe002e49b38be204b`](https://polygonscan.com/address/0xc6a4c5ec25f624729ccbdb0fe002e49b38be204b#code) |
| Batch registry v2 | [`0x101036a06cecb95c580515ec027ee20f8e917215`](https://polygonscan.com/address/0x101036a06cecb95c580515ec027ee20f8e917215#code) |

Verification is free (`dogrula(bytes32)`). Each record costs a GEPARA fee; half is burned, half goes to the operator.

## Files

| File | Purpose |
|---|---|
| `dosya-kaniti.html` | File Proof: get a proof, make a handover pack, check a file (10 languages) |
| `index.html` | GEPARA expert report verification |
| `defter.html` | Open Ledger: everything recorded so far, read live from the chain |
| `seffaflik.html` | Transparency: who runs it, what is and is not promised |
| `rehber/`, `guide/` | Practical guides (Turkish / English) |

Everything is static HTML + JavaScript. No server, no database, no tracking.

## Honest limits

- A blockchain timestamp is evidence, not a notarisation or a qualified electronic timestamp; a court weighs it like other evidence.
- No independent security audit yet. The contracts are short; please review them.
- GEPARA is not an investment product. There is no promise of price, return or listing. Not legal or financial advice.

## Contact

info@gepara.com · [X](https://x.com/tokengepara) · [Instagram](https://www.instagram.com/geparatoken/) · [Facebook](https://www.facebook.com/profile.php?id=61596130500525)

License: MIT · **GETOKEN**
