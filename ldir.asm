ld hl, 30000
ld de, 16384
ld bc, 6912
ld a, (hl)
ld (hl), a
ld (addr), a, 23606
ld (ix + n ), 30000, 5
ld a, (addr), 23606
ldir
ret