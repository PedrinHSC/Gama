package com.avaliacaoteste.web.rest;

import com.avaliacaoteste.domain.MetaNota;
import com.avaliacaoteste.repository.MetaNotaRepository;
import com.avaliacaoteste.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.avaliacaoteste.domain.MetaNota}.
 */
@RestController
@RequestMapping("/api/meta-notas")
@Transactional
public class MetaNotaResource {

    private static final Logger LOG = LoggerFactory.getLogger(MetaNotaResource.class);

    private static final String ENTITY_NAME = "metaNota";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MetaNotaRepository metaNotaRepository;

    public MetaNotaResource(MetaNotaRepository metaNotaRepository) {
        this.metaNotaRepository = metaNotaRepository;
    }

    /**
     * {@code POST  /meta-notas} : Create a new metaNota.
     *
     * @param metaNota the metaNota to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new metaNota, or with status {@code 400 (Bad Request)} if the metaNota has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<MetaNota> createMetaNota(@Valid @RequestBody MetaNota metaNota) throws URISyntaxException {
        LOG.debug("REST request to save MetaNota : {}", metaNota);
        if (metaNota.getId() != null) {
            throw new BadRequestAlertException("A new metaNota cannot already have an ID", ENTITY_NAME, "idexists");
        }
        metaNota = metaNotaRepository.save(metaNota);
        return ResponseEntity.created(new URI("/api/meta-notas/" + metaNota.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, metaNota.getId().toString()))
            .body(metaNota);
    }

    /**
     * {@code PUT  /meta-notas/:id} : Updates an existing metaNota.
     *
     * @param id the id of the metaNota to save.
     * @param metaNota the metaNota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated metaNota,
     * or with status {@code 400 (Bad Request)} if the metaNota is not valid,
     * or with status {@code 500 (Internal Server Error)} if the metaNota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<MetaNota> updateMetaNota(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody MetaNota metaNota
    ) throws URISyntaxException {
        LOG.debug("REST request to update MetaNota : {}, {}", id, metaNota);
        if (metaNota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, metaNota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metaNotaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        metaNota = metaNotaRepository.save(metaNota);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, metaNota.getId().toString()))
            .body(metaNota);
    }

    /**
     * {@code PATCH  /meta-notas/:id} : Partial updates given fields of an existing metaNota, field will ignore if it is null
     *
     * @param id the id of the metaNota to save.
     * @param metaNota the metaNota to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated metaNota,
     * or with status {@code 400 (Bad Request)} if the metaNota is not valid,
     * or with status {@code 404 (Not Found)} if the metaNota is not found,
     * or with status {@code 500 (Internal Server Error)} if the metaNota couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<MetaNota> partialUpdateMetaNota(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody MetaNota metaNota
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update MetaNota partially : {}, {}", id, metaNota);
        if (metaNota.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, metaNota.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!metaNotaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<MetaNota> result = metaNotaRepository
            .findById(metaNota.getId())
            .map(existingMetaNota -> {
                if (metaNota.getArea() != null) {
                    existingMetaNota.setArea(metaNota.getArea());
                }
                if (metaNota.getMeta() != null) {
                    existingMetaNota.setMeta(metaNota.getMeta());
                }

                return existingMetaNota;
            })
            .map(metaNotaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, metaNota.getId().toString())
        );
    }

    /**
     * {@code GET  /meta-notas} : get all the metaNotas.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of metaNotas in body.
     */
    @GetMapping("")
    public ResponseEntity<List<MetaNota>> getAllMetaNotas(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of MetaNotas");
        Page<MetaNota> page = metaNotaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /meta-notas/:id} : get the "id" metaNota.
     *
     * @param id the id of the metaNota to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the metaNota, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MetaNota> getMetaNota(@PathVariable("id") Long id) {
        LOG.debug("REST request to get MetaNota : {}", id);
        Optional<MetaNota> metaNota = metaNotaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(metaNota);
    }

    /**
     * {@code DELETE  /meta-notas/:id} : delete the "id" metaNota.
     *
     * @param id the id of the metaNota to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetaNota(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete MetaNota : {}", id);
        metaNotaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
