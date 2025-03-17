package com.avaliacaoteste.web.rest;

import static com.avaliacaoteste.domain.MetaNotaAsserts.*;
import static com.avaliacaoteste.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.avaliacaoteste.IntegrationTest;
import com.avaliacaoteste.domain.MetaNota;
import com.avaliacaoteste.repository.MetaNotaRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link MetaNotaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class MetaNotaResourceIT {

    private static final String DEFAULT_AREA = "AAAAAAAAAA";
    private static final String UPDATED_AREA = "BBBBBBBBBB";

    private static final Integer DEFAULT_META = 0;
    private static final Integer UPDATED_META = 1;

    private static final String ENTITY_API_URL = "/api/meta-notas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private MetaNotaRepository metaNotaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMetaNotaMockMvc;

    private MetaNota metaNota;

    private MetaNota insertedMetaNota;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MetaNota createEntity() {
        return new MetaNota().area(DEFAULT_AREA).meta(DEFAULT_META);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static MetaNota createUpdatedEntity() {
        return new MetaNota().area(UPDATED_AREA).meta(UPDATED_META);
    }

    @BeforeEach
    public void initTest() {
        metaNota = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedMetaNota != null) {
            metaNotaRepository.delete(insertedMetaNota);
            insertedMetaNota = null;
        }
    }

    @Test
    @Transactional
    void createMetaNota() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the MetaNota
        var returnedMetaNota = om.readValue(
            restMetaNotaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            MetaNota.class
        );

        // Validate the MetaNota in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertMetaNotaUpdatableFieldsEquals(returnedMetaNota, getPersistedMetaNota(returnedMetaNota));

        insertedMetaNota = returnedMetaNota;
    }

    @Test
    @Transactional
    void createMetaNotaWithExistingId() throws Exception {
        // Create the MetaNota with an existing ID
        metaNota.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMetaNotaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota)))
            .andExpect(status().isBadRequest());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAreaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        metaNota.setArea(null);

        // Create the MetaNota, which fails.

        restMetaNotaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkMetaIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        metaNota.setMeta(null);

        // Create the MetaNota, which fails.

        restMetaNotaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllMetaNotas() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        // Get all the metaNotaList
        restMetaNotaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(metaNota.getId().intValue())))
            .andExpect(jsonPath("$.[*].area").value(hasItem(DEFAULT_AREA)))
            .andExpect(jsonPath("$.[*].meta").value(hasItem(DEFAULT_META)));
    }

    @Test
    @Transactional
    void getMetaNota() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        // Get the metaNota
        restMetaNotaMockMvc
            .perform(get(ENTITY_API_URL_ID, metaNota.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(metaNota.getId().intValue()))
            .andExpect(jsonPath("$.area").value(DEFAULT_AREA))
            .andExpect(jsonPath("$.meta").value(DEFAULT_META));
    }

    @Test
    @Transactional
    void getNonExistingMetaNota() throws Exception {
        // Get the metaNota
        restMetaNotaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMetaNota() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the metaNota
        MetaNota updatedMetaNota = metaNotaRepository.findById(metaNota.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedMetaNota are not directly saved in db
        em.detach(updatedMetaNota);
        updatedMetaNota.area(UPDATED_AREA).meta(UPDATED_META);

        restMetaNotaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMetaNota.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedMetaNota))
            )
            .andExpect(status().isOk());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedMetaNotaToMatchAllProperties(updatedMetaNota);
    }

    @Test
    @Transactional
    void putNonExistingMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, metaNota.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota))
            )
            .andExpect(status().isBadRequest());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(metaNota))
            )
            .andExpect(status().isBadRequest());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(metaNota)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMetaNotaWithPatch() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the metaNota using partial update
        MetaNota partialUpdatedMetaNota = new MetaNota();
        partialUpdatedMetaNota.setId(metaNota.getId());

        partialUpdatedMetaNota.area(UPDATED_AREA).meta(UPDATED_META);

        restMetaNotaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMetaNota.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMetaNota))
            )
            .andExpect(status().isOk());

        // Validate the MetaNota in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMetaNotaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedMetaNota, metaNota), getPersistedMetaNota(metaNota));
    }

    @Test
    @Transactional
    void fullUpdateMetaNotaWithPatch() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the metaNota using partial update
        MetaNota partialUpdatedMetaNota = new MetaNota();
        partialUpdatedMetaNota.setId(metaNota.getId());

        partialUpdatedMetaNota.area(UPDATED_AREA).meta(UPDATED_META);

        restMetaNotaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMetaNota.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedMetaNota))
            )
            .andExpect(status().isOk());

        // Validate the MetaNota in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertMetaNotaUpdatableFieldsEquals(partialUpdatedMetaNota, getPersistedMetaNota(partialUpdatedMetaNota));
    }

    @Test
    @Transactional
    void patchNonExistingMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, metaNota.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(metaNota))
            )
            .andExpect(status().isBadRequest());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(metaNota))
            )
            .andExpect(status().isBadRequest());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMetaNota() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        metaNota.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMetaNotaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(metaNota)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the MetaNota in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMetaNota() throws Exception {
        // Initialize the database
        insertedMetaNota = metaNotaRepository.saveAndFlush(metaNota);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the metaNota
        restMetaNotaMockMvc
            .perform(delete(ENTITY_API_URL_ID, metaNota.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return metaNotaRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected MetaNota getPersistedMetaNota(MetaNota metaNota) {
        return metaNotaRepository.findById(metaNota.getId()).orElseThrow();
    }

    protected void assertPersistedMetaNotaToMatchAllProperties(MetaNota expectedMetaNota) {
        assertMetaNotaAllPropertiesEquals(expectedMetaNota, getPersistedMetaNota(expectedMetaNota));
    }

    protected void assertPersistedMetaNotaToMatchUpdatableProperties(MetaNota expectedMetaNota) {
        assertMetaNotaAllUpdatablePropertiesEquals(expectedMetaNota, getPersistedMetaNota(expectedMetaNota));
    }
}
