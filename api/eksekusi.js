const notifHasil = `*HASIL EKSEKUSI DIGIFLAZZ E-CELL*
Ref: ${ref}
SKU: ${sku}
Tujuan: ${tujuan} ${server?`| Server: ${server}`:''}
Total: Rp ${total||'-'}
Status: ${statusDigiflazz}
Waktu: ${new Date().toLocaleString('id-ID')}

E-CELL Yogyakarta`;
