<?php

namespace App\Models;

use App\Http\Resources\SimpegResource;
use Illuminate\Support\Facades\DB;

class Simpeg
{
    public static function getBiodata($request)
    {
        $person = DB::connection('mysql')->select("SELECT
            CONCAT(IF(p.gldepan IS NULL or p.gldepan = '', '', CONCAT(p.gldepan, '. ')), p.nama, IF(p.glblk IS NULL or p.glblk = '', '', CONCAT(', ', p.glblk))) AS nama, 
            p.kjkel,
            p.nopen,
            p.ktlahir AS kotalahir,
            p.tlahir AS tglahir,
            t.ntpu AS pend_akhir,
            i.nibu AS nama_ibu,
            k.nskawin AS status_kawin,
            s.nisua AS nama_pasangan,
            s.ktlahir AS kotalahir_pasangan,
            s.tlahir AS tglahir_pasangan,
            (SELECT COUNT(*) FROM riw_anak AS w WHERE w.nip = p.nip) AS jumlah_tanggungan,
            p.npwp,
            g.ngolru AS gol,
            j.njab AS jabatan,
            p.nip, 
            e.neselon AS esl,
            u.nunker AS dinas,
            p.aljalan AS alamat,
            p.alrt AS rt,
            p.alrw AS rw,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', p.file_nopen) AS file_ktp,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', p.file_kk) AS file_kk,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', s.file_karis_su) AS file_aktenikah,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', p.file_npwp) AS file_npwp,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', p.file_ntaspen) AS file_taspen,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', p.file_nkarpeg) AS file_karpeg,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', z.file_skcpns) AS file_skcpns,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', l.file_skpns) AS file_skpns,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', a.file_nskpang) AS file_skpangkat,
            CONCAT('https://simpeg.bantenprov.go.id/foto/', p.nip, '/', b.file_kgb) AS file_skgb
        FROM peg_identpeg AS p
        JOIN peg_pdakhir AS d ON p.nip = d.nip
        JOIN ref_tpu AS t ON d.ktpu = LEFT(t.ktp, 2)
        JOIN riw_ibukand AS i ON p.nip = i.nip
        JOIN ref_skawin AS k ON p.kskawin = k.kskawin
        JOIN riw_sistri AS s ON p.nip = s.nip AND s.isakhir = 1
        JOIN peg_pakhir AS a ON p.nip = a.nip
        JOIN peg_jakhir AS j ON p.nip = j.nip
        JOIN ref_golruang AS g ON a.kgolru = g.kgolru
        JOIN ref_eselon AS e ON j.keselon = e.keselon
        JOIN ref_unkerja AS u ON CONCAT(LEFT(j.kunker, 4), '00000000000') = u.kunker
        JOIN peg_acpns AS z ON p.nip = z.nip
        JOIN peg_apns AS l ON p.nip = l.nip
        JOIN peg_gkkhir AS b ON p.nip = b.nip
        WHERE p.nip = '$request->nip'
        ORDER BY dinas, p.nip");

        return new SimpegResource($person);
    }
}