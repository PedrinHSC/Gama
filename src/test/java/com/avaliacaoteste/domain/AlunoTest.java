package com.avaliacaoteste.domain;

import static com.avaliacaoteste.domain.AlunoTestSamples.*;
import static com.avaliacaoteste.domain.MetaNotaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.avaliacaoteste.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class AlunoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Aluno.class);
        Aluno aluno1 = getAlunoSample1();
        Aluno aluno2 = new Aluno();
        assertThat(aluno1).isNotEqualTo(aluno2);

        aluno2.setId(aluno1.getId());
        assertThat(aluno1).isEqualTo(aluno2);

        aluno2 = getAlunoSample2();
        assertThat(aluno1).isNotEqualTo(aluno2);
    }

    @Test
    void metaNotaTest() {
        Aluno aluno = getAlunoRandomSampleGenerator();
        MetaNota metaNotaBack = getMetaNotaRandomSampleGenerator();

        aluno.addMetaNota(metaNotaBack);
        assertThat(aluno.getMetaNotas()).containsOnly(metaNotaBack);
        assertThat(metaNotaBack.getAluno()).isEqualTo(aluno);

        aluno.removeMetaNota(metaNotaBack);
        assertThat(aluno.getMetaNotas()).doesNotContain(metaNotaBack);
        assertThat(metaNotaBack.getAluno()).isNull();

        aluno.metaNotas(new HashSet<>(Set.of(metaNotaBack)));
        assertThat(aluno.getMetaNotas()).containsOnly(metaNotaBack);
        assertThat(metaNotaBack.getAluno()).isEqualTo(aluno);

        aluno.setMetaNotas(new HashSet<>());
        assertThat(aluno.getMetaNotas()).doesNotContain(metaNotaBack);
        assertThat(metaNotaBack.getAluno()).isNull();
    }
}
