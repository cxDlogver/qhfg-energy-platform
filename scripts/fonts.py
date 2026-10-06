import sys, json, hashlib
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.recordingPen import RecordingPen
source_root, target_root, proof_path = map(Path, sys.argv[1:4])
proof = []
for name in ['YouSheBiaoTiHei-2.ttf', 'SourceHanSansOLD-Light-2.otf', '液晶数字字体.TTF']:
    source = source_root / 'font' / name
    target = (target_root / 'font' / name).with_suffix('.woff2')
    before = TTFont(source, recalcTimestamp=False)
    before.flavor = 'woff2'
    before.save(target)
    after = TTFont(target, recalcTimestamp=False)
    assert before.getBestCmap() == after.getBestCmap()
    assert before.getGlyphOrder() == after.getGlyphOrder()
    assert before['hmtx'].metrics == after['hmtx'].metrics
    a, b = before.getGlyphSet(), after.getGlyphSet()
    digest = hashlib.sha256()
    for glyph in before.getGlyphOrder():
        pa, pb = RecordingPen(), RecordingPen()
        a[glyph].draw(pa); b[glyph].draw(pb)
        assert pa.value == pb.value, glyph
        digest.update(repr(pa.value).encode())
    proof.append({'source': name, 'target': target.name, 'beforeBytes': source.stat().st_size, 'afterBytes': target.stat().st_size, 'glyphs': len(before.getGlyphOrder()), 'cmapCount': len(before.getBestCmap()), 'allGlyphOutlinesSha256': digest.hexdigest(), 'metricsEqual': True})
    print(name + ' full glyphs verified')
proof_path.write_text(json.dumps(proof, ensure_ascii=False, indent=2), encoding='utf8')
