# 📘 Matematika Lengkap: SMP hingga Perkuliahan Internasional

> Dokumen referensi komprehensif yang merangkum **konsep inti, rumus kunci, dan contoh** matematika dari jenjang SMP, SMA, hingga tingkat universitas (setara kurikulum internasional / S1 dan pengantar S2).
>
> **Catatan:** Dokumen ini adalah *peta rumus & konsep* yang lengkap dari segi **cakupan topik** (bukan buku teks dengan ratusan latihan soal per bab — itu setara puluhan buku terpisah). Gunakan sebagai referensi cepat, kerangka belajar, atau titik awal sebelum mendalami satu topik secara khusus.
>
> Notasi ditulis dalam format LaTeX (`$...$` untuk inline, `$$...$$` untuk block). Gunakan viewer yang mendukung rendering matematika (Obsidian, Typora, VS Code + ekstensi Markdown+Math, Jupyter, GitHub, dll) agar rumus tampil rapi.

---

## 🗂️ Daftar Isi

**BAGIAN I — Matematika SMP (Kelas 7–9)**
1. Bilangan (Bulat, Pecahan, Desimal, Persen)
2. Himpunan
3. Bentuk Aljabar
4. Persamaan Linear Satu Variabel
5. Pertidaksamaan Linear Satu Variabel
6. Perbandingan (Senilai & Berbalik Nilai)
7. Aritmetika Sosial
8. Pola Bilangan dan Barisan
9. Relasi dan Fungsi
10. Persamaan Garis Lurus
11. Sistem Persamaan Linear Dua Variabel
12. Garis dan Sudut
13. Segitiga dan Segiempat
14. Teorema Pythagoras
15. Lingkaran
16. Bangun Ruang Sisi Datar
17. Bangun Ruang Sisi Lengkung
18. Statistika Dasar
19. Peluang Dasar
20. Transformasi Geometri

**BAGIAN II — Matematika SMA (Kelas 10–12)**
1. Eksponen dan Bentuk Akar
2. Logaritma
3. Persamaan dan Fungsi Kuadrat
4. Pertidaksamaan (Kuadrat, Rasional, Mutlak)
5. SPLTV dan Program Linear
6. Matriks
7. Vektor
8. Trigonometri Dasar
9. Identitas dan Persamaan Trigonometri
10. Aturan Sinus, Cosinus, dan Luas Segitiga
11. Barisan dan Deret Aritmetika
12. Barisan dan Deret Geometri
13. Limit Fungsi
14. Turunan (Diferensial)
15. Aplikasi Turunan
16. Integral
17. Aplikasi Integral
18. Statistika Lanjut
19. Kaidah Pencacahan, Permutasi, Kombinasi
20. Peluang
21. Persamaan Lingkaran dan Irisan Kerucut
22. Bilangan Kompleks

**BAGIAN III — Matematika Universitas (International Curriculum)**
- **A. Calculus (Kalkulus I–III)**
- **B. Linear Algebra (Aljabar Linear)**
- **C. Differential Equations (Persamaan Diferensial)**
- **D. Real Analysis (Analisis Real)**
- **E. Abstract Algebra (Aljabar Abstrak)**
- **F. Discrete Mathematics (Matematika Diskrit)**
- **G. Probability & Statistics (Probabilitas & Statistika Lanjut)**
- **H. Topik Lanjutan** (Complex Analysis, Topology, Number Theory, Numerical Methods, Optimization, Mathematical Logic)

---

# BAGIAN I — MATEMATIKA SMP (KELAS 7–9)

### 1. Bilangan (Bulat, Pecahan, Desimal, Persen)

**Konsep:** Bilangan bulat $\mathbb{Z} = \{...,-2,-1,0,1,2,...\}$, bilangan pecahan $\frac{a}{b}$ dengan $b \neq 0$, desimal, dan persen adalah representasi berbeda dari nilai yang sama.

**Rumus Kunci:**
- Konversi pecahan ke persen: $\frac{a}{b} \times 100\%$
- Operasi pecahan: $\frac{a}{b} + \frac{c}{d} = \frac{ad+bc}{bd}$, $\frac{a}{b} \times \frac{c}{d} = \frac{ac}{bd}$, $\frac{a}{b} \div \frac{c}{d} = \frac{a}{b} \times \frac{d}{c}$
- KPK dan FPB: FPB $\times$ KPK $= a \times b$
- Bilangan berpangkat: $a^m \times a^n = a^{m+n}$, $a^m \div a^n = a^{m-n}$, $(a^m)^n = a^{mn}$

**Contoh:** Sederhanakan $\frac{3}{4} + \frac{2}{5}$. Penyebut sama (KPK 4 dan 5 = 20): $\frac{15}{20} + \frac{8}{20} = \frac{23}{20} = 1\frac{3}{20}$.

---

### 2. Himpunan

**Konsep:** Himpunan (set) adalah kumpulan objek yang terdefinisi dengan jelas. Dinotasikan dengan huruf kapital, anggotanya dengan huruf kecil atau simbol $\in$.

**Rumus Kunci:**
- Irisan: $A \cap B$ (anggota di A dan B)
- Gabungan: $A \cup B$ (anggota di A atau B)
- Komplemen: $A^c$ atau $A'$ (anggota di semesta tapi bukan di A)
- Selisih: $A - B$
- Banyak anggota gabungan: $n(A \cup B) = n(A) + n(B) - n(A \cap B)$
- Himpunan bagian: jika $A \subseteq B$, banyak himpunan bagian dari A adalah $2^{n(A)}$

**Contoh:** Jika $n(A)=10$, $n(B)=8$, $n(A \cap B)=3$, maka $n(A \cup B) = 10+8-3=15$.

---

### 3. Bentuk Aljabar

**Konsep:** Ekspresi matematika yang memuat variabel (huruf), koefisien, dan konstanta, misalnya $3x^2 + 2x - 5$.

**Rumus Kunci — Pemfaktoran & Perkalian Istimewa:**
- $(a+b)^2 = a^2+2ab+b^2$
- $(a-b)^2 = a^2-2ab+b^2$
- $a^2-b^2=(a+b)(a-b)$
- $(a+b)^3 = a^3+3a^2b+3ab^2+b^3$
- Pemfaktoran bentuk $ax^2+bx+c$: cari dua bilangan yang jumlahnya $b$ dan hasil kalinya $ac$

**Contoh:** Faktorkan $x^2+7x+12$. Cari dua bilangan berjumlah 7, hasil kali 12 → 3 dan 4. Maka $(x+3)(x+4)$.

---

### 4. Persamaan Linear Satu Variabel (PLSV)

**Konsep:** Persamaan berbentuk $ax+b=c$ dengan satu variabel berpangkat satu.

**Rumus Kunci:**
- Bentuk umum: $ax + b = c \Rightarrow x = \frac{c-b}{a}$
- Prinsip: operasi yang sama pada kedua ruas tidak mengubah nilai kebenaran persamaan

**Contoh:** $2x+5=13 \Rightarrow 2x=8 \Rightarrow x=4$.

---

### 5. Pertidaksamaan Linear Satu Variabel (PtLSV)

**Konsep:** Mirip PLSV tapi menggunakan tanda $<, \leq, >, \geq$.

**Rumus Kunci:**
- Aturan sama seperti persamaan, KECUALI: jika kedua ruas dikali/dibagi bilangan **negatif**, tanda pertidaksamaan **dibalik**
- Solusi berupa interval/himpunan, bukan satu nilai

**Contoh:** $-2x+4>10 \Rightarrow -2x>6 \Rightarrow x<-3$ (tanda dibalik karena dibagi $-2$).

---

### 6. Perbandingan (Senilai & Berbalik Nilai)

**Konsep:** Perbandingan senilai: dua besaran naik/turun bersama. Perbandingan berbalik nilai: satu naik, yang lain turun.

**Rumus Kunci:**
- Senilai: $\frac{a_1}{b_1} = \frac{a_2}{b_2}$ (grafik linear melalui origin)
- Berbalik nilai: $a_1 \times b_1 = a_2 \times b_2$
- Skala peta: skala $= \frac{\text{jarak pada peta}}{\text{jarak sebenarnya}}$

**Contoh:** 5 pekerja menyelesaikan proyek dalam 12 hari. Jika 3 pekerja, berapa hari? (berbalik nilai) $5 \times 12 = 3 \times d \Rightarrow d=20$ hari.

---

### 7. Aritmetika Sosial

**Konsep:** Penerapan matematika dalam ekonomi sehari-hari: untung, rugi, bunga, pajak, diskon.

**Rumus Kunci:**
- Untung $= $ Harga Jual $-$ Harga Beli (jika positif)
- Persentase untung/rugi $= \frac{\text{untung/rugi}}{\text{harga beli}} \times 100\%$
- Bunga tunggal: $B = \frac{P \times r \times t}{100}$ (P=modal, r=persen/tahun, t=waktu)
- Diskon: Harga akhir $=$ Harga awal $\times (1 - \text{persen diskon})$
- Bruto, Netto, Tara: Bruto $=$ Netto $+$ Tara

**Contoh:** Barang dibeli Rp80.000, dijual Rp100.000. Untung $=$ Rp20.000, persentase untung $= \frac{20.000}{80.000}\times100\% = 25\%$.

---

### 8. Pola Bilangan dan Barisan

**Konsep:** Susunan bilangan yang mengikuti aturan tertentu.

**Rumus Kunci:**
- Barisan aritmetika: $U_n = a+(n-1)b$, dengan $b$ = beda
- Barisan geometri: $U_n = a \cdot r^{n-1}$, dengan $r$ = rasio
- Pola bilangan segitiga: $\frac{n(n+1)}{2}$
- Pola bilangan persegi: $n^2$

**Contoh:** Barisan $2,5,8,11,...$ punya beda $b=3$, sehingga $U_{10}=2+(10-1)(3)=29$.

---

### 9. Relasi dan Fungsi

**Konsep:** Relasi menghubungkan anggota dua himpunan. Fungsi (pemetaan) adalah relasi khusus di mana setiap anggota domain berpasangan dengan **tepat satu** anggota kodomain.

**Rumus Kunci:**
- Notasi fungsi: $f: x \to f(x)$ atau $y=f(x)$
- Domain (daerah asal), Kodomain (daerah kawan), Range (daerah hasil)
- Fungsi linear: $f(x)=mx+c$

**Contoh:** $f(x)=2x+1$. Nilai $f(3)=2(3)+1=7$.

---

### 10. Persamaan Garis Lurus

**Konsep:** Representasi grafik dari fungsi linear berbentuk garis lurus pada bidang koordinat.

**Rumus Kunci:**
- Bentuk umum: $y=mx+c$ (m = gradien, c = titik potong sumbu-y)
- Gradien dari 2 titik: $m = \frac{y_2-y_1}{x_2-x_1}$
- Persamaan garis melalui satu titik: $y-y_1=m(x-x_1)$
- Garis sejajar: $m_1=m_2$. Garis tegak lurus: $m_1 \times m_2=-1$

**Contoh:** Garis melalui $(2,3)$ dan $(4,7)$: $m=\frac{7-3}{4-2}=2$. Persamaan: $y-3=2(x-2) \Rightarrow y=2x-1$.

---

### 11. Sistem Persamaan Linear Dua Variabel (SPLDV)

**Konsep:** Dua persamaan linear dengan dua variabel yang dicari solusinya secara bersamaan.

**Rumus Kunci — Metode Penyelesaian:**
- **Substitusi**: nyatakan satu variabel dalam variabel lain, substitusikan ke persamaan lain
- **Eliminasi**: hilangkan salah satu variabel dengan menjumlah/mengurangkan persamaan
- **Grafik**: titik potong dua garis adalah solusinya

**Contoh:** $x+y=10$ dan $x-y=2$. Eliminasi: jumlahkan → $2x=12 \Rightarrow x=6$, maka $y=4$.

---

### 12. Garis dan Sudut

**Konsep:** Dasar geometri: hubungan antar garis dan besar sudut yang terbentuk.

**Rumus Kunci:**
- Sudut berpelurus (bersuplemen): jumlah $=180°$
- Sudut berpenyiku (berkomplemen): jumlah $=90°$
- Dua garis sejajar dipotong garis transversal: sudut sehadap sama besar, sudut dalam berseberangan sama besar, sudut dalam sepihak jumlahnya $180°$

**Contoh:** Jika sudut A dan B berpelurus dan sudut A $=65°$, maka sudut B $=180°-65°=115°$.

---

### 13. Segitiga dan Segiempat

**Konsep:** Bangun datar dasar dengan berbagai jenis dan sifat.

**Rumus Kunci:**
- Jumlah sudut segitiga $=180°$; segiempat $=360°$
- Luas segitiga $=\frac{1}{2} \times \text{alas} \times \text{tinggi}$
- Luas persegi panjang $= p \times l$; persegi $=s^2$
- Luas trapesium $=\frac{1}{2}(a+b) \times t$
- Luas jajar genjang $=$ alas $\times$ tinggi
- Luas belah ketupat $=\frac{1}{2} \times d_1 \times d_2$
- Keliling $=$ jumlah semua sisi

**Contoh:** Segitiga dengan alas 10 cm, tinggi 6 cm → Luas $=\frac{1}{2}\times10\times6=30$ cm².

---

### 14. Teorema Pythagoras

**Konsep:** Berlaku pada segitiga siku-siku: kuadrat sisi miring sama dengan jumlah kuadrat dua sisi lainnya.

**Rumus Kunci:**
- $c^2=a^2+b^2$ (c = sisi miring/hipotenusa)
- Tripel Pythagoras umum: $(3,4,5)$, $(5,12,13)$, $(8,15,17)$, $(7,24,25)$

**Contoh:** Sisi siku-siku 6 dan 8. Hipotenusa $=\sqrt{6^2+8^2}=\sqrt{100}=10$.

---

### 15. Lingkaran

**Konsep:** Kumpulan titik berjarak sama (jari-jari) dari satu titik pusat.

**Rumus Kunci:**
- Keliling $=2\pi r = \pi d$
- Luas $=\pi r^2$
- Panjang busur $=\frac{\theta}{360°}\times 2\pi r$
- Luas juring $=\frac{\theta}{360°}\times \pi r^2$
- Sudut pusat $=2\times$ sudut keliling (menghadap busur yang sama)

**Contoh:** Lingkaran jari-jari 7 cm ($\pi\approx\frac{22}{7}$): Luas $=\frac{22}{7}\times49=154$ cm².

---

### 16. Bangun Ruang Sisi Datar

**Konsep:** Bangun 3 dimensi dengan permukaan datar: kubus, balok, prisma, limas.

**Rumus Kunci:**
- Kubus: Volume $=s^3$, Luas permukaan $=6s^2$
- Balok: Volume $=p\times l\times t$, Luas permukaan $=2(pl+pt+lt)$
- Prisma: Volume $=$ Luas alas $\times$ tinggi
- Limas: Volume $=\frac{1}{3}\times$ Luas alas $\times$ tinggi

**Contoh:** Balok $5\times4\times3$ cm → Volume $=60$ cm³.

---

### 17. Bangun Ruang Sisi Lengkung

**Konsep:** Bangun 3 dimensi dengan permukaan lengkung: tabung, kerucut, bola.

**Rumus Kunci:**
- Tabung: Volume $=\pi r^2 t$, Luas permukaan $=2\pi r(r+t)$
- Kerucut: Volume $=\frac{1}{3}\pi r^2 t$, Luas permukaan $=\pi r(r+s)$ (s = garis pelukis)
- Bola: Volume $=\frac{4}{3}\pi r^3$, Luas permukaan $=4\pi r^2$

**Contoh:** Bola jari-jari 6 cm → Volume $=\frac{4}{3}\pi(6)^3=288\pi\approx904{,}3$ cm³.

---

### 18. Statistika Dasar

**Konsep:** Pengumpulan, penyajian, dan analisis data sederhana.

**Rumus Kunci:**
- Mean (rata-rata): $\bar{x}=\frac{\sum x_i}{n}$
- Median: nilai tengah data terurut
- Modus: nilai yang paling sering muncul
- Jangkauan (range) $=$ data maksimum $-$ data minimum

**Contoh:** Data $4,6,8,8,9$: Mean $=\frac{35}{5}=7$, Median $=8$, Modus $=8$.

---

### 19. Peluang Dasar

**Konsep:** Ukuran kemungkinan suatu kejadian terjadi.

**Rumus Kunci:**
- $P(A)=\frac{n(A)}{n(S)}$ (n(A)=banyak kejadian A, n(S)=banyak ruang sampel)
- $0 \leq P(A) \leq 1$
- $P(A^c)=1-P(A)$

**Contoh:** Peluang muncul angka genap pada dadu: $A=\{2,4,6\}$, $P(A)=\frac{3}{6}=\frac{1}{2}$.

---

### 20. Transformasi Geometri

**Konsep:** Perubahan posisi/ukuran suatu objek geometri: translasi, refleksi, rotasi, dilatasi.

**Rumus Kunci:**
- Translasi oleh $(a,b)$: $(x,y)\to(x+a,y+b)$
- Refleksi terhadap sumbu-x: $(x,y)\to(x,-y)$; terhadap sumbu-y: $(x,y)\to(-x,y)$
- Rotasi $90°$ berlawanan arah jarum jam terhadap origin: $(x,y)\to(-y,x)$
- Dilatasi faktor skala $k$ terhadap origin: $(x,y)\to(kx,ky)$

**Contoh:** Titik $(2,3)$ ditranslasi oleh $(1,-2)$ menjadi $(3,1)$.

# BAGIAN II — MATEMATIKA SMA (KELAS 10–12)

### 1. Eksponen dan Bentuk Akar

**Konsep:** Eksponen adalah pangkat dari suatu bilangan. Bentuk akar adalah kebalikan dari eksponen.

**Rumus Kunci:**
- $a^m \cdot a^n = a^{m+n}$
- $a^m \div a^n = a^{m-n}$
- $(a^m)^n = a^{mn}$
- $a^{-n} = \frac{1}{a^n}$, $a^0 = 1$ ($a \neq 0$)
- $a^{m/n} = \sqrt[n]{a^m}$
- $\sqrt{a} \cdot \sqrt{b} = \sqrt{ab}$, $\frac{\sqrt{a}}{\sqrt{b}} = \sqrt{\frac{a}{b}}$

**Contoh:** Sederhanakan $\frac{2^5 \cdot 2^3}{2^4} = 2^{5+3-4} = 2^4 = 16$.

---

### 2. Logaritma

**Konsep:** Logaritma adalah kebalikan dari eksponen. $\log_a b = c$ artinya $a^c = b$.

**Rumus Kunci:**
- $\log_a (ab) = \log_a b + \log_a c$
- $\log_a \frac{b}{c} = \log_a b - \log_a c$
- $\log_a b^n = n \cdot \log_a b$
- $\log_a b = \frac{\ln b}{\ln a}$ (aturan pergantian basis)
- $\log_a a = 1$, $\log_a 1 = 0$
- $a^{\log_a b} = b$

**Contoh:** $\log_2 32 = \log_2 2^5 = 5$.

---

### 3. Persamaan dan Fungsi Kuadrat

**Konsep:** Persamaan kuadrat berbentuk $ax^2+bx+c=0$ dengan $a \neq 0$.

**Rumus Kunci:**
- Rumus kuadrat: $x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$
- Diskriminan: $D = b^2-4ac$. Jika $D>0$ ada 2 akar, $D=0$ satu akar, $D<0$ tidak akar riil
- hubungan akar-koefisien: $x_1+x_2 = -\frac{b}{a}$, $x_1 \cdot x_2 = \frac{c}{a}$
- Bentuk sempurna: $y = a(x-p)^2 + q$ dengan titik puncak $(p,q)$

**Contoh:** $x^2-5x+6=0 \Rightarrow (x-2)(x-3)=0 \Rightarrow x=2$ atau $x=3$.

---

### 4. Pertidaksamaan (Kuadrat, Rasional, Mutlak)

**Konsep:** Pertidaksamaan melibatkan tanda $<, \leq, >, \geq$ pada ekspresi kuadrat, rasional, atau nilai mutlak.

**Rumus Kunci:**
- Kuadrat: tentukan tanda $a$ dan akar-akarnya, lalu tentukan interval dari tabel tanda
- Rasional: $\frac{f(x)}{g(x)} > 0$ sama dengan $f(x) \cdot g(x) > 0$ dengan syarat $g(x) \neq 0$
- Mutlak: $|x| < a \Leftrightarrow -a < x < a$; $|x| > a \Leftrightarrow x < -a$ atau $x > a$

**Contoh:** $|2x-3| < 5 \Rightarrow -5 < 2x-3 < 5 \Rightarrow -1 < x < 4$.

---

### 5. SPLTV dan Program Linear

**Konsep:** Sistem Persamaan Linear Tiga Variabel (SPLTV) melibatkan 3 variabel. Program Linear mencari nilai optimum dari fungsi objektif dengan kendala linear.

**Rumus Kunci:**
- SPLTV diselesaikan dengan eliminasi atau substitusi berulang
- Fungsi objektif: $z = ax + by + c$ (dihargakan maksimum/minimum)
- Solusi optimal selalu pada titik pojok daerah penyelesaian (DPR)

**Contoh:** Minimalkan $z = 2x + 3y$ dengan kendala $x+y \geq 4$, $x+2y \geq 6$, $x,y \geq 0$.

---

### 6. Matriks

**Konsep:** Matriks adalah susunan bilangan dalam baris dan kolom. Digunakan untuk menyistemkan persamaan linear dan transformasi.

**Rumus Kunci:**
- Penjumlahan: $(a_{ij}) + (b_{ij}) = (a_{ij}+b_{ij})$
- Perkalian: $(AB)_{ij} = \sum a_{ik} \cdot b_{kj}$
- Determinan 2x2: $\det(A) = ad-bc$ untuk $A = \begin{pmatrix} a & b \\ c & d \end{pmatrix}$
- Matriks balikan: $A^{-1} = \frac{1}{\det(A)} \text{adj}(A)$ jika $\det(A) \neq 0$
- SPLDV dengan matriks: $AX=B \Rightarrow X=A^{-1}B$

**Contoh:** $A = \begin{pmatrix} 2 & 1 \\ 5 & 3 \end{pmatrix}$, $\det(A) = 6-5 = 1$, $A^{-1} = \begin{pmatrix} 3 & -1 \\ -5 & 2 \end{pmatrix}$.

---

### 7. Vektor

**Konsep:** Vektor adalah besaran yang memiliki besar dan arah. Ditulis $\vec{v} = (x, y)$ atau $\vec{v} = x\hat{i} + y\hat{j}$.

**Rumus Kunci:**
- Penjumlahan: $\vec{u}+\vec{v} = (u_1+v_1, u_2+v_2)$
- Perkalian skalar: $k\vec{v} = (kv_1, kv_2)$
- Besar vektor: $|\vec{v}| = \sqrt{x^2+y^2}$
- Vektor satuan: $\hat{v} = \frac{\vec{v}}{|\vec{v}|}$
- Dot product: $\vec{u} \cdot \vec{v} = u_1v_1 + u_2v_2 = |\vec{u}||\vec{v}|\cos\theta$
- $\vec{u} \perp \vec{v} \Leftrightarrow \vec{u} \cdot \vec{v} = 0$

**Contoh:** $\vec{a}=(3,4)$, besar $= \sqrt{9+16}=5$, vektor satuan $= (\frac{3}{5}, \frac{4}{5})$.

---

### 8. Trigonometri Dasar

**Konsep:** Trigonometri mempelajari hubungan sudut dan sisi segitiga. Didefinisikan pada lingkaran satuan.

**Rumus Kunci:**
- $\sin\theta = \frac{depan}{miring}$, $\cos\theta = \frac{samping}{miring}$, $\tan\theta = \frac{depan}{samping}$
- Nilai khusus: $\sin 30° = \frac{1}{2}$, $\cos 30° = \frac{\sqrt{3}}{2}$, $\tan 45° = 1$
- Identitas: $\sin^2\theta + \cos^2\theta = 1$
- $\tan\theta = \frac{\sin\theta}{\cos\theta}$
- Sudut negatif: $\sin(-\theta) = -\sin\theta$, $\cos(-\theta) = \cos\theta$

**Contoh:** Jika $\sin\theta = \frac{3}{5}$ dan $\theta$ segitiga siku-siku, maka $\cos\theta = \frac{4}{5}$, $\tan\theta = \frac{3}{4}$.

---

### 9. Identitas dan Persamaan Trigonometri

**Konsep:** Identitas trigonometri adalah persamaan yang selalu benar untuk semua nilai sudut.

**Rumus Kunci:**
- Penjumlahan sudut: $\sin(A \pm B) = \sin A \cos B \pm \cos A \sin B$
- $\cos(A \pm B) = \cos A \cos B \mp \sin A \sin B$
- $\tan(A \pm B) = \frac{\tan A \pm \tan B}{1 \mp \tan A \tan B$
- Dwidit: $\sin 2A = 2\sin A \cos A$, $\cos 2A = \cos^2 A - \sin^2 A$
- Setengah sudut: $\sin^2 \frac{A}{2} = \frac{1-\cos A}{2}$

**Contoh:** $\sin 75° = \sin(45°+30°) = \frac{\sqrt{6}+\sqrt{2}}{4}$.

---

### 10. Aturan Sinus, Cosinus, dan Luas Segitiga

**Konsep:** Aturan sinus dan cosinus digunakan menyelesaikan segitiga yang tidak siku-siku.

**Rumus Kunci:**
- Aturan sinus: $\frac{a}{\sin A} = \frac{b}{\sin B} = \frac{c}{\sin C} = 2R$
- Aturan cosinus: $c^2 = a^2+b^2 - 2ab\cos C$
- Luas segitiga: $L = \frac{1}{2}ab\sin C$

**Contoh:** Segitiga $a=5, b=7, C=60°$. Luas $= \frac{1}{2}(5)(7)\sin 60° = \frac{35\sqrt{3}}{4}$.

---

### 11. Barisan dan Deret Aritmetika

**Konsep:** Barisan aritmetika punya beda tetap. Deret aritmetika adalah jumlah suku-sukunya.

**Rumus Kunci:**
- Suku ke-n: $U_n = a + (n-1)b$
- Jumlah n suku: $S_n = \frac{n}{2}(2a + (n-1)b) = \frac{n}{2}(a + U_n)$
- Rata-rata: $\bar{x} = \frac{a + U_n}{2}$

**Contoh:** Barisan 3, 7, 11, 15, ... → $a=3, b=4$. $U_{10} = 3 + 9(4) = 39$.

---

### 12. Barisan dan Deret Geometri

**Konsep:** Barisan geometri punya rasio tetap. Deret geometri adalah jumlah suku-sukunya.

**Rumus Kunci:**
- Suku ke-n: $U_n = a \cdot r^{n-1}$
- Jumlah n suku: $S_n = \frac{a(r^n - 1)}{r - 1}$ untuk $r \neq 1$
- Jumlah tak hingga: $S_\infty = \frac{a}{1-r}$ untuk $|r| < 1$

**Contoh:** Barisan 2, 6, 18, 54, ... → $a=2, r=3$. $S_5 = \frac{2(3^5-1)}{3-1} = 242$.

---

### 13. Limit Fungsi

**Konsep:** Limit menggambarkan nilai yang didekati fungsi saat $x$ mendekati nilai tertentu.

**Rumus Kunci:**
- $\lim_{x \to a} c = c$, $\lim_{x \to a} x = a$
- $\lim_{x \to a} [f(x) \pm g(x)] = \lim f(x) \pm \lim g(x)$
- $\lim_{x \to a} [f(x) \cdot g(x)] = \lim f(x) \cdot \lim g(x)$
- Limit tak tentu $\frac{0}{0}$: faktorkan atau gunakan rasionalisasi
- $\lim_{x \to 0} \frac{\sin x}{x} = 1$

**Contoh:** $\lim_{x \to 2} \frac{x^2-4}{x-2} = \lim_{x \to 2} (x+2) = 4$.

---

### 14. Turunan (Diferensial)

**Konsep:** Turunan mengukur laju perubahan suatu fungsi. $f'(x) = \lim_{h \to 0} \frac{f(x+h)-f(x)}{h}$.

**Rumus Kunci:**
- $(c)' = 0$, $(x^n)' = nx^{n-1}$
- $(\sin x)' = \cos x$, $(\cos x)' = -\sin x$
- $(e^x)' = e^x$, $(\ln x)' = \frac{1}{x}$
- Aturan rantai: $[f(g(x))]' = f'(g(x)) \cdot g'(x)$
- $(fg)' = f'g + fg'$, $\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}$

**Contoh:** $f(x) = 3x^2 + 2x$, $f'(x) = 6x + 2$.

---

### 15. Aplikasi Turunan

**Konsep:** Turunan digunakan untuk mencari gradien, nilai maksimum/minimum, dan tentu fungsi.

**Rumus Kunci:**
- Gradien garis singgung: $m = f'(x_0)$
- Fungsi naik: $f'(x) > 0$; fungsi turun: $f'(x) < 0$
- Kritis: $f'(x) = 0$ atau tidak terdefinisi
- Maksimum: $f'(x)=0$ dan $f''(x) < 0$; Minimum: $f'(x)=0$ dan $f''(x) > 0$

**Contoh:** $f(x)=x^2-4x+3$, $f'(x)=2x-4=0 \Rightarrow x=2$. Titik minimum $(2,-1)$.

---

### 16. Integral

**Konsep:** Integral adalah kebalikan turunan. Integral tentu: $\int_a^b f(x)dx = F(b)-F(a)$.

**Rumus Kunci:**
- $\int x^n dx = \frac{x^{n+1}}{n+1} + C$ ($n \neq -1$)
- $\int \sin x \, dx = -\cos x + C$
- $\int \cos x \, dx = \sin x + C$
- $\int e^x dx = e^x + C$
- $\int \frac{1}{x} dx = \ln|x| + C$

**Contoh:** $\int_0^1 (3x^2+2x) dx = [x^3+x^2]_0^1 = 2$.

---

### 17. Aplikasi Integral

**Konsep:** Integral digunakan untuk menghitung luas area, volume benda putar, dan panjang kurva.

**Rumus Kunci:**
- Luas area: $L = \int_a^b |f(x)-g(x)| \, dx$
- Volume benda putar sumbu-x: $V = \pi \int_a^b [f(x)]^2 dx$
- Volume benda putar sumbu-y: $V = 2\pi \int_a^b x \cdot f(x) dx$ (metode selaput)

**Contoh:** Luas area di bawah $y=x^2$ dari $x=0$ ke $x=2$: $L = \int_0^2 x^2 dx = \frac{8}{3}$.

---

### 18. Statistika Lanjut

**Konsep:** Statistika lanjut mencakup ukuran tendensi sentral, dispersi, dan distribusi data.

**Rumus Kunci:**
- Mean: $\bar{x} = \frac{\sum f_i x_i}{\sum f_i}$
- Varian: $s^2 = \frac{\sum f_i(x_i - \bar{x})^2}{\sum f_i}$
- Standar deviasi: $s = \sqrt{s^2}$
- Kuartil: $Q_1, Q_2$ (median), $Q_3$
- Skor Z: $z = \frac{x - \bar{x}}{s}$

**Contoh:** Data 4,6,8,10,12. Mean $= 8$, Varian $= 8$, Standar deviasi $= 2\sqrt{2}$.

---

### 19. Kaidah Pencacahan, Permutasi, Kombinasi

**Konsep:** Kaidah pencacahan menghitung banyak cara melakukan sesuatu.

**Rumus Kunci:**
- Kaidah penjumlahan: $n(A \cup B) = n(A) + n(B)$ (jika disjoint)
- Kaidah perkalian: $n = n_1 \times n_2 \times \cdots \times n_k$
- Permutasi: $P(n,r) = \frac{n!}{(n-r)!}$
- Kombinasi: $C(n,r) = \binom{n}{r} = \frac{n!}{r!(n-r)!}$

**Contoh:** $\binom{10}{3} = \frac{10!}{3!7!} = 120$ cara memilih 3 dari 10.

---

### 20. Peluang

**Konsep:** Peluang mengukur kemungkinan kejadian. $0 \leq P(A) \leq 1$.

**Rumus Kunci:**
- $P(A) = \frac{n(A)}{n(S)}$ (peluang klasik)
- $P(A \cup B) = P(A) + P(B) - P(A \cap B)$
- $P(A \cap B) = P(A) \cdot P(B|A)$
- Kejadian bebas: $P(A \cap B) = P(A) \cdot P(B)$
- Peluang komplementer: $P(A^c) = 1 - P(A)$

**Contoh:** 2 dadu dilempar. $P(\text{jumlah 7}) = \frac{6}{36} = \frac{1}{6}$.

---

### 21. Persamaan Lingkaran dan Irisan Kerucut

**Konsep:** Persamaan lingkaran: $(x-a)^2 + (y-b)^2 = r^2$ dengan pusat $(a,b)$ dan jari-jari $r$.

**Rumus Kunci:**
- Pusat $(a,b)$, jari-jari $r$
- Irisan kerucut: lingkaran, ellipse, parabola, hiperbola tergantung sudut irisan
- Ellipse: $\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$
- Hiperbola: $\frac{x^2}{a^2} - \frac{y^2}{b^2} = 1$
- Parabola: $y^2 = 4px$ atau $x^2 = 4py$

**Contoh:** Lingkaran $(x-2)^2 + (y+3)^2 = 25$. Pusat $(2,-3)$, $r=5$.

---

### 22. Bilangan Kompleks

**Konsep:** Bilangan kompleks berbentuk $z = a + bi$ dengan $i^2 = -1$.

**Rumus Kunci:**
- Konjugat: $\overline{z} = a - bi$
- Besar: $|z| = \sqrt{a^2+b^2}$
- Perkalian: $(a+bi)(c+di) = (ac-bd) + (ad+bc)i$
- Bentuk eksponensial: $z = r(\cos\theta + i\sin\theta) = re^{i\theta}$
- Teorema De Moivre: $z^n = r^n(\cos n\theta + i\sin n\theta)$

**Contoh:** $z = 3+4i$, $|z| = 5$, $\overline{z} = 3-4i$.

---

# BAGIAN III — MATEMATIKA UNIVERSITAS (INTERNATIONAL CURRICULUM)

### A. Calculus (Kalkulus I–III)

**Konsep:** Kalkulus mempelajari limit, turunan, dan integral fungsi satu dan beberapa variabel.

**Topik Utama:**
- **Kalkulus I:** Limit, turunan, aplikasi turunan, integral tentu dan tak tentu
- **Kalkulus II:** Integral teknik, deret tak hingga, integral parameter
- **Kalkulus III:** Turunan parsial, gradien, integral lipat, integral garis dan permukaan

**Rumus Kunci:**
- Aturan L'Hôpital: $\lim \frac{f(x)}{g(x)} = \lim \frac{f'(x)}{g'(x)}$ jika tak tentu
- Integrasi parsial: $\int u \, dv = uv - \int v \, du$
- Green, Stokes, Divergence theorem

---

### B. Linear Algebra (Aljabar Linear)

**Konsep:** Aljabar linear mempelajari vektor, matriks, ruang vektor, dan transformasi linear.

**Topik Utama:**
- Sistem persamaan linear dan eliminasi Gauss
- Determinan, invers, dan rank matriks
- Ruang vektor, basis, dimensi
- Nilai eigen dan vektor eigen
- Diagonalisasi dan bentuk kanonik

**Rumus Kunci:**
- Eliminasi Gauss-Jordan untuk SPL
- $Av = \lambda v$ (nilai eigen)
- $\det(AB) = \det(A)\det(B)$

---

### C. Differential Equations (Persamaan Diferensial)

**Konsep:** Persamaan differensial menghubungkan fungsi dengan turunannya.

**Topik Utama:**
- Persamaan differensial orde 1 (variabel terpisah, linear, homogen)
- Persamaan differensial orde 2 (konstanta koefisien)
- Transformasi Laplace
- Sistem persamaan differensial

**Rumus Kunci:**
- $\frac{dy}{dx} = f(x)g(y) \Rightarrow \int \frac{dy}{g(y)} = \int f(x)dx$
- Karakteristik: $ar^2+br+c=0$ untuk orde 2
- $\mathcal{L}\{f'(t)\} = sF(s) - f(0)$

---

### D. Real Analysis (Analisis Real)

**Konsep:** Analisis real adalah fondasi rigor kalkulus: limit, kontinuitas, differensiabilitas, dan integrabilitas.

**Topik Utama:**
- Bilangan real, supremum, infimum
- Limit dan kontinuitas fungsi
- Konvergensi barisan dan deret
- Integrasi Riemann dan Lebesgue
- Teorema dasar kalkulus (bukti rigor)

---

### E. Abstract Algebra (Aljabar Abstrak)

**Konsep:** Aljabar abstrak mempelajari struktur aljabar: grup, ring, dan field.

**Topik Utama:**
- Grup: definisi, subgrup, grup simetri
- Ring dan ideal
- Field dan ekstensi field
- Teorema Lagrange, isomorfisme

---

### F. Discrete Mathematics (Matematika Diskrit)

**Konsep:** Matematika diskrit mempelajari struktur diskrit: graf, pohon, logika, dan kombinatorik.

**Topik Utama:**
- Logika proposisi dan predikat
- Graf: sifat, lintasan, sirkuit
- Pohon dan algoritma graf
- Teorema kemanjuran dan induksi
- Aljabar Boolean

---

### G. Probability & Statistics (Probabilitas & Statistika Lanjut)

**Konsep:** Probabilitas dan statistika lanjut: distribusi, inferensi, dan hipotesis.

**Topik Utama:**
- Variabel acak diskrit dan kontinu
- Distribusi: binomial, Poisson, normal, eksponensial
- Teorema batas pusat
- Estimasi parameter dan uji hipotesis
- Regresi dan korelasi

---

### H. Topik Lanjutan

- **Complex Analysis:** Fungsi bilangan kompleks, integral kontur, residu
- **Topology:** Ruang topologi, kontinuitas topologis, fundamental group
- **Number Theory:** Teorema bilangan bulat, primalitas, kriptografi
- **Numerical Methods:** Aproksimasi, iterasi, metode numerik untuk PDE
- **Optimization:** Optimasi linear dan non-linear, metode gradien
- **Mathematical Logic:** Teori kebenaran, kalkulus predikat, konsistensi
