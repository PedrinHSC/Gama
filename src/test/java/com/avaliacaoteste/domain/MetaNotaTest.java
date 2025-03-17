package com.avaliacaoteste.domain;

import static com.avaliacaoteste.domain.AlunoTestSamples.*;
import static com.avaliacaoteste.domain.MetaNotaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.avaliacaoteste.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MetaNotaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(MetaNota.class);
        MetaNota metaNota1 = getMetaNotaSample1();
        MetaNota metaNota2 = new MetaNota();
        assertThat(metaNota1).isNotEqualTo(metaNota2);

        metaNota2.setId(metaNota1.getId());
        assertThat(metaNota1).isEqualTo(metaNota2);

        metaNota2 = getMetaNotaSample2();
        assertThat(metaNota1).isNotEqualTo(metaNota2);
    }

    @Test
    void alunoTest() {
        MetaNota metaNota = getMetaNotaRandomSampleGenerator();
        Aluno alunoBack = getAlunoRandomSampleGenerator();

        metaNota.setAluno(alunoBack);
        assertThat(metaNota.getAluno()).isEqualTo(alunoBack);

        metaNota.aluno(null);
        assertThat(metaNota.getAluno()).isNull();
    }
}
