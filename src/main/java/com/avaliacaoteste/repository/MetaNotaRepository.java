package com.avaliacaoteste.repository;

import com.avaliacaoteste.domain.MetaNota;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the MetaNota entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MetaNotaRepository extends JpaRepository<MetaNota, Long> {}
