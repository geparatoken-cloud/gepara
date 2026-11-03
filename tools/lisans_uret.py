#!/usr/bin/env python3
"""GETOKEN lisans kodu üretici.

Kullanım:
  python3 tools/lisans_uret.py URUN SIPARIS_NO [--adet N] [--baslangic YYYY-MM-DD]

URUN: tek, teslim, dogr, k10, k50, pro1, pro12, buro1
Kod düz metin olarak yalnızca ekrana yazılır; lisans.json'a yalnızca SHA-256 özeti eklenir.
"""
import argparse, datetime as dt, hashlib, json, os, secrets, sys

URUNLER = {
    # urun: (plan, kontor_sayisi, ay)
    'tek':   ('kontor', 1,  None),
    'teslim':('kontor', 4,  None),
    'dogr':  ('kontor', 2,  None),
    'k10':   ('kontor', 10, None),
    'k50':   ('kontor', 50, None),
    'pro1':  ('pro',    None, 1),
    'pro12': ('pro',    None, 12),
    'buro1': ('buro',   None, 1),
}
ADLAR = {'tek':'PDF kanıt raporu (1 kontör)','teslim':'Teslim paketi raporu (4 kontör)','dogr':'Resmî doğrulama raporu (2 kontör)',
         'k10':"10'lu kontör paketi",'k50':"50'li kontör paketi",'pro1':'Pro üyelik – 1 ay','pro12':'Pro üyelik – 1 yıl','buro1':'Büro üyelik – 1 ay'}
ABC = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'  # karışan harfler (I, O, 0, 1) yok

def kod():
    return 'GK-' + '-'.join(''.join(secrets.choice(ABC) for _ in range(4)) for _ in range(3))

def ay_ekle(d, n):
    y, m = divmod(d.month - 1 + n, 12)
    y += d.year; m += 1
    import calendar
    return d.replace(year=y, month=m, day=min(d.day, calendar.monthrange(y, m)[1]))

def main():
    p = argparse.ArgumentParser()
    p.add_argument('urun', choices=URUNLER)
    p.add_argument('siparis')
    p.add_argument('--adet', type=int, default=1)
    p.add_argument('--baslangic')
    p.add_argument('--json', default=os.path.join(os.path.dirname(__file__), '..', 'lisans.json'))
    a = p.parse_args()
    plan, n, ay = URUNLER[a.urun]
    bas = dt.date.fromisoformat(a.baslangic) if a.baslangic else dt.date.today()
    L = json.load(open(a.json, encoding='utf-8'))
    var = {e['h'] for e in L}
    cikti = []
    for _ in range(a.adet):
        while True:
            c = kod(); h = hashlib.sha256(c.encode()).hexdigest()
            if h not in var: break
        e = {'h': h, 'plan': plan, 'not': a.siparis}
        if n: e['n'] = n
        if ay: e['exp'] = ay_ekle(bas, ay).isoformat()
        L.append(e); var.add(h)
        cikti.append((c, e))
    json.dump(L, open(a.json, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    for c, e in cikti:
        bit = e.get('exp', 'süresiz')
        print(f"{c}\t{ADLAR[a.urun]}\t{a.siparis}\tbitiş: {bit}")

if __name__ == '__main__':
    main()
