package com.avaliacaoteste.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A MetaNota.
 */
@Entity
@Table(name = "meta_nota")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class MetaNota implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "area", nullable = false)
    private String area;

    @NotNull
    @Min(value = 0)
    @Max(value = 1000)
    @Column(name = "meta", nullable = false)
    private Integer meta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "metaNotas" }, allowSetters = true)
    private Aluno aluno;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public MetaNota id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getArea() {
        return this.area;
    }

    public MetaNota area(String area) {
        this.setArea(area);
        return this;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public Integer getMeta() {
        return this.meta;
    }

    public MetaNota meta(Integer meta) {
        this.setMeta(meta);
        return this;
    }

    public void setMeta(Integer meta) {
        this.meta = meta;
    }

    public Aluno getAluno() {
        return this.aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public MetaNota aluno(Aluno aluno) {
        this.setAluno(aluno);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof MetaNota)) {
            return false;
        }
        return getId() != null && getId().equals(((MetaNota) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "MetaNota{" +
            "id=" + getId() +
            ", area='" + getArea() + "'" +
            ", meta=" + getMeta() +
            "}";
    }
}
