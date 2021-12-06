ld a, (addr), 30000
ld a, (bc)
ld a, (de)
ld a, (hl)
ld a, (ix+offset),  5
ld a, (iy+offset),  5
ld a, a
ld a, b
ld a, c
ld a, d
ld a, e
ld a, h
ld a, i
ld a, l

ld hl, 30000
ld de, 16384
ld bc, 6912
ld a, (hl)
ld (hl), a
ld (addr), a, 23606
ld (ix + offset ), 5
ld a, (addr), 23606
ldir
js nz, d, -5
ret